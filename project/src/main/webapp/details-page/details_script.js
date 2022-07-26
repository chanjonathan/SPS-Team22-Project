import {createMap} from '../map/map.js';

var map;
var marker = null;
var report;
var edit = false;
var mapListener;
var imagePosition = 0;
var imagesLength = 0;

function GetURLParameter(sParam) {
    var sPageURL = window.location.search.substring(1);
    var sURLVariables = sPageURL.split('&');
    for (var i = 0; i < sURLVariables.length; i++) {
        var sParameterName = sURLVariables[i].split('=');
        if (sParameterName[0] == sParam) {
            return sParameterName[1];
        }
    }
}

function resetDetails() {
    let dotsContainer = document.getElementById("dots-container");
    let dots = dotsContainer.getElementsByClassName("Dot");
    while (dots.length > 0) {
        dots[0].remove();
    }
    let dotsEnabled = dotsContainer.getElementsByClassName("Dot Enable");
    while (dotsEnabled.length > 0) {
        dotsEnabled[0].remove();
    }

    let imagesContainer = document.getElementById("images-container");
    let images = imagesContainer.getElementsByClassName("Image");
    while (images.length > 0) {
        images[0].remove();
    }

    imagePosition = 0;
    imagesLength = 0;
}

async function loadDetails() {
    const entryID = GetURLParameter("entryID");

    const fetchedJSON = await fetch("/get-by-id?entryID=" + entryID);
    report = await fetchedJSON.json();

    let date = new Date(report.date);

    let date = new Date(report.date);

    document.getElementById("title-container").innerText = report.title;
    document.getElementById("date-container").innerText = date.toDateString() + ", " + date.toLocaleTimeString();
    document.getElementById("description-container").innerText = report.description;
    document.getElementById("contact-details-container").innerText = report.contactDetails;

    imagesLength = report.imageURLs.length;
    let imagesContainer = document.getElementById("images-container")
    let dotsContainer = document.getElementById("dots-container")
    for (let i = 0; i < imagesLength; i++) {
        let image = document.createElement("IMG");
        image.setAttribute("class", "Image");
        image.setAttribute("width", "100%");
        image.setAttribute("src", report.imageURLs[i]);

        imagesContainer.appendChild(image);

        let dot = document.createElement("SPAN");
        dot.setAttribute("class", "Dot");
        dot.setAttribute("onclick", "changeSlide(" + i.toString() + ")");

        dotsContainer.appendChild(dot);
    }
    slideShow();
}

async function deletePost() {
    await fetch('/delete?' + new URLSearchParams({entryID: report.entryID}), {method: "DELETE"})
    alert("Report Deleted");
    window.location.href = "/index.html";
}

function toggleDetails() {
    const editElements = document.getElementsByClassName("Edit");
    for (let i = 0; i < editElements.length; i++) {
        if (edit === true) {
            editElements[i].style.display = "";
        } else {
            editElements[i].style.display = "none";
        }
    }
    const viewElements = document.getElementsByClassName("View");
    for (let i = 0; i < viewElements.length; i++) {
        if (edit === true) {
            viewElements[i].style.display = "none";
        } else {
            viewElements[i].style.display = "";
        }
    }
}

function setDetails() {
    const editElements = document.getElementsByClassName("Edit");
    for (let i = 0; i < editElements.length; i++) {
        editElements[i].style.display = "none";
        editElements[i].style.visibility = "visible";

    }
    const viewElements = document.getElementsByClassName("View");
    for (let i = 0; i < viewElements.length; i++) {
        viewElements[i].style.display = "";
        viewElements[i].style.visibility = "visible";
    }
}

function editMode() {
    resetEdit();
    toggleMode();
}

function resetEdit() {
    document.getElementById("edit-title-container").value = report.title;
    document.getElementById("edit-date-container").value = report.date
    document.getElementById("edit-description-container").value = report.description;
    document.getElementById("edit-contact-details-container").value = report.contactDetails;

    let imagesContainer = document.getElementById("edit-images-container");
    let images = imagesContainer.getElementsByTagName('*');
    while (images.length > 0) {
        images[0].remove();
    }
    for (let i = 0; i < report.imageURLs.length; i++) {
        let imageContainer = document.createElement("a");

        let oldImage = document.createElement("img");
        oldImage.src = report.imageURLs[i];
        oldImage.setAttribute("class", "Image-old")
        imageContainer.appendChild(oldImage);

        let overlay = document.createElement("img");
        overlay.src = "../images/close.png";
        overlay.setAttribute("class", "Overlay")
        imageContainer.appendChild(overlay);

        let imagesContainer = document.getElementById('edit-images-container');
        imagesContainer.setAttribute("style", "display: ''");
        imagesContainer.appendChild(imageContainer);

        overlay.addEventListener("click", function () {
            deleteImage(imageContainer, null)
        });
    }

    let uploadContainer = document.getElementById("new-image-upload-container");
    let uploadInputs = uploadContainer.getElementsByTagName('*');
    while (uploadInputs.length > 0) {
        uploadInputs[0].remove();
    }
    let newInput = document.createElement("input");
    newInput.setAttribute("type", "file");
    newInput.setAttribute("class", "Image-input");
    newInput.setAttribute("name", "images");
    uploadContainer.appendChild(newInput);

    imagesContainer.scrollLeft = 100000;
}

function toggleMode() {
    edit = !edit;
    toggleDetails();
    toggleMap();
}

function cancel() {
    toggleMode();
    placeMarker();
}

async function saveEdits() {
    let editContainer = document.getElementById("edit-container");
    let data = new FormData(editContainer)

    let oldImageURLs = [];
    let imagesContainer = document.getElementById("edit-images-container");
    let oldImages = imagesContainer.getElementsByClassName("Image-old");
    for (let i = 0; i < oldImages.length; i++) {
        oldImageURLs.push(oldImages[i].src);
    }
    let jsonURLs = JSON.stringify(oldImageURLs);

    fetch('/put?' +
        new URLSearchParams(
            {
                title: document.getElementById("edit-title-container").value,
                latitude: marker.getPosition().lat().toString(),
                longitude: marker.getPosition().lng().toString(),
                date: document.getElementById("edit-date-container").value,
                description: document.getElementById("edit-description-container").value,
                contactDetails: document.getElementById("edit-contact-details-container").value,
                imageURLs: jsonURLs,
                entryID: report.entryID,
            }),
        {method: "PUT", body: data}
    ).then(() => {
        resetDetails();
        loadDetails().then(() => {
            toggleMode();
            placeMarker();
        });
    });
}

function toggleMap() {
    if (edit === true) {
        mapListener = google.maps.event.addListener(map, "click", (mapsMouseEvent) => {
            newMarker(mapsMouseEvent)
        });
    } else {
        google.maps.event.removeListener(mapListener);
        placeMarker();
    }
}

function newMarker(mapsMouseEvent) {
    if (marker != null) {
        marker.setMap(null);
        marker = null;
    }
    marker = new google.maps.Marker({
        position: mapsMouseEvent.latLng,
        map: map,
        url: '/',
        animation: google.maps.Animation.DROP,
    });
}

function placeMarker() {
    if (marker != null) {
        marker.setMap(null);
        marker = null;
    }
    let location = {lat: parseFloat(report.latitude), lng: parseFloat(report.longitude)};
    marker = new google.maps.Marker({
        position: new google.maps.LatLng(location),
        map: map,
        url: '/',
        animation: google.maps.Animation.DROP
    });
    map.setCenter(location);
    map.setZoom(13);
}

function deleteImage(imageContainer, oldInput) {
    imageContainer.remove();
    if (oldInput != null) {
        oldInput.remove();
    }

    let imagesContainer = document.getElementById('images-container');
    if (imagesContainer.childElementCount == 0) {
        imagesContainer.setAttribute("style", "display: none");
    }
}

function loadImage(event) {
    let imageContainer = document.createElement("a");

    let newImage = document.createElement("img");
    newImage.src = URL.createObjectURL(event.target.files[0]);
    newImage.setAttribute("class", "Image-new")
    imageContainer.appendChild(newImage);

    let overlay = document.createElement("img");
    overlay.src = "../images/close.png";
    overlay.setAttribute("class", "Overlay")
    imageContainer.appendChild(overlay);

    let imagesContainer = document.getElementById('edit-images-container');
    imagesContainer.setAttribute("style", "display: ''");
    imagesContainer.appendChild(imageContainer);
    imagesContainer.scrollLeft = imagesContainer.scrollWidth;

    let uploadContainer = document.getElementById('new-image-upload-container');
    let uploadInputs = uploadContainer.getElementsByTagName('*');
    for (let i = 0; i < uploadInputs.length; ++i) {
        uploadInputs[i].setAttribute("style", "display: none;");
    }
    let newInput = document.createElement("input");
    newInput.setAttribute("type", "file");
    newInput.setAttribute("class", "Image-input");
    newInput.setAttribute("name", "images");
    uploadContainer.appendChild(newInput);

    let oldInput = event.target;
    overlay.addEventListener("click", function () {
        deleteImage(imageContainer, oldInput)
    });

}

function addListeners() {
    document.getElementById("delete-button").addEventListener("click", deletePost);
    document.getElementById("edit-button").addEventListener("click", editMode);
    document.getElementById("save-button").addEventListener("click", saveEdits);
    document.getElementById("cancel-button").addEventListener("click", cancel);
    document.getElementById("new-image-upload-container").addEventListener("change", (event) => {
        loadImage(event)
    });
}

function slideShow() {
    let dotsContainer = document.getElementById("dots-container")
    let imagesContainer = document.getElementById("images-container")

    let images = imagesContainer.getElementsByClassName("Image");
    let dots = dotsContainer.getElementsByClassName("Dot");

    for (let i = 0; i < imagesLength; i++) {
        images[i].style.display = "none";
        dots[i].className = dots[i].className.replace(" Enabled", "");
    }
    images[imagePosition].style.display = "block";
    dots[imagePosition].className += " Enabled";
}

function changeSlide(n) {
    imagePosition = n;
    slideShow();
}

function incrementSlide(d) {
    imagePosition = ((imagePosition + d) + imagesLength) % imagesLength;
    slideShow();
}

function initialize() {
    addListeners();
    setDetails();
    map = createMap();
    loadDetails().then(() => placeMarker());
}

window.changeSlide = changeSlide;
window.incrementSlide = incrementSlide;
window.initialize = initialize;
