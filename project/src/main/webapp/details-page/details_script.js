var latitude;
var longitude;
var map;

var slidePosition = 1;
var slideLength = 0;

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


async function loadDetails() {
    const entryID = GetURLParameter("entryID");

    const fetchedJSON = await fetch("/get-by-id?entryID=" + entryID);
    const report = await fetchedJSON.json();

    document.getElementById("title-container").innerText = report.title;
    document.getElementById("date-container").innerText = new Date(report.date).toDateString();
    document.getElementById("description-container").innerText = report.description;
    document.getElementById("contact-details-container").innerText = report.contactDetails;

    slideLength = report.imageURLs.length;
    imagesContainer = document.getElementById("images-container")
    dotsContainer = document.getElementById("dots-container")
    for (i = 0; i < slideLength; i++) {
        var slide = document.createElement("IMG");
        slide.setAttribute("class", "slide");
        slide.setAttribute("width", "400");
        slide.setAttribute("src", report.imageURLs[i]);

        slide.appendChild(slide);

        var dot = document.createElement("SPAN");
        dot.setAttribute("class", "dots");
        dot.setAttribute("onclick", "currentSlide(" + i.toString + ")");

        dotsContainer.appendChild(dot);
    }

    document.getElementById("entry-id-container").value = entryID;

    latitude = parseInt(report.latitude);
    longitude = parseInt(report.longitude);
}


function createMap() {
    // Create a new StyledMapType object, passing it an array of styles,
    // and the name to be displayed on the map type control.
    const styledMapType = new google.maps.StyledMapType(
        [
            {elementType: "geometry", stylers: [{color: "#ebe3cd"}]},
            {elementType: "labels.text.fill", stylers: [{color: "#523735"}]},
            {elementType: "labels.text.stroke", stylers: [{color: "#f5f1e6"}]},
            {
                featureType: "administrative",
                elementType: "geometry.stroke",
                stylers: [{color: "#c9b2a6"}],
            },
            {
                featureType: "administrative.land_parcel",
                elementType: "geometry.stroke",
                stylers: [{color: "#dcd2be"}],
            },
            {
                featureType: "administrative.land_parcel",
                elementType: "labels.text.fill",
                stylers: [{color: "#ae9e90"}],
            },
            {
                featureType: "landscape.natural",
                elementType: "geometry",
                stylers: [{color: "#dfd2ae"}],
            },
            {
                featureType: "poi",
                elementType: "geometry",
                stylers: [{color: "#dfd2ae"}],
            },
            {
                featureType: "poi",
                elementType: "labels.text.fill",
                stylers: [{color: "#93817c"}],
            },
            {
                featureType: "poi.park",
                elementType: "geometry.fill",
                stylers: [{color: "#a5b076"}],
            },
            {
                featureType: "poi.park",
                elementType: "labels.text.fill",
                stylers: [{color: "#447530"}],
            },
            {
                featureType: "road",
                elementType: "geometry",
                stylers: [{color: "#f5f1e6"}],
            },
            {
                featureType: "road.arterial",
                elementType: "geometry",
                stylers: [{color: "#fdfcf8"}],
            },
            {
                featureType: "road.highway",
                elementType: "geometry",
                stylers: [{color: "#f8c967"}],
            },
            {
                featureType: "road.highway",
                elementType: "geometry.stroke",
                stylers: [{color: "#e9bc62"}],
            },
            {
                featureType: "road.highway.controlled_access",
                elementType: "geometry",
                stylers: [{color: "#e98d58"}],
            },
            {
                featureType: "road.highway.controlled_access",
                elementType: "geometry.stroke",
                stylers: [{color: "#db8555"}],
            },
            {
                featureType: "road.local",
                elementType: "labels.text.fill",
                stylers: [{color: "#806b63"}],
            },
            {
                featureType: "transit.line",
                elementType: "geometry",
                stylers: [{color: "#dfd2ae"}],
            },
            {
                featureType: "transit.line",
                elementType: "labels.text.fill",
                stylers: [{color: "#8f7d77"}],
            },
            {
                featureType: "transit.line",
                elementType: "labels.text.stroke",
                stylers: [{color: "#ebe3cd"}],
            },
            {
                featureType: "transit.station",
                elementType: "geometry",
                stylers: [{color: "#dfd2ae"}],
            },
            {
                featureType: "water",
                elementType: "geometry.fill",
                stylers: [{color: "#b9d3c2"}],
            },
            {
                featureType: "water",
                elementType: "labels.text.fill",
                stylers: [{color: "#92998d"}],
            },
        ],
        {name: "Styled Map"}
    );
    /** Creates a map and adds it to the page. */

    map = new google.maps.Map(
        document.getElementById('map'),
        {
            center: {lat: 0, lng: 0}, zoom: 1,
            mapTypeControlOptions: {
                mapTypeIds: ["roadmap", "satellite", "hybrid", "terrain", "styled_map"],
            }
        }
    );
    map.mapTypes.set("styled_map", styledMapType);
    map.setMapTypeId("styled_map");
}

async function placeMarker() {
    let location = {lat: latitude, lng: longitude};
    var marker = new google.maps.Marker({
        position: new google.maps.LatLng(location),
        map: map,
        url: '/',
        animation: google.maps.Animation.DROP
    });
    map.setCenter(location);
    map.setZoom(10);
}

function mapAndMark() {
    createMap();
    placeMarker();
}

function slideShow() {
    var slides = document.getElementsByClassName("slide");
    var dots = document.getElementsByClassName("dots");

    for (i = 0; i < slideLength; i++) {
        slides[i].style.display = "none";
        circles[i].className = circles[i].className.replace(" enable", "");
    }
    slides[slidePosition].style.display = "block";
    circles[slidePosition].className += " enable";
}

function changeSlide(n) {
    slidePosition = n;
    slideShow();
}

function incrementSlide(d) {
    slidePosition = (slidePosition + d) % slideLength;
    slideShow();
}

function initialize() {
    loadDetails().then(() => mapAndMark());
}

