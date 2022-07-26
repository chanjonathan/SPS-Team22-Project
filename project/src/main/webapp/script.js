// Copyright 2020 Google LLC
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     https://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

import {createMap} from './map/map.js';
import {setFocus} from './map/map.js';

var map;
var markers = [];
var userLocation;

// Fill start and end time inputs with appropriate datetimes
function fillDateTimes() {
    const date = new Date();
    const offset = (24 * 60 * 60 * 1000) * 7;

    const localNow = (new Date(date.getTime() - date.getTimezoneOffset() * 60000).toISOString()).slice(0, -1);
    const localStart = (new Date(date.getTime() - date.getTimezoneOffset() * 60000 - offset).toISOString()).slice(0, -1);

    document.getElementById("start-time").value = localStart;
    document.getElementById("end-time").value = localNow;
}

// retrieves reporters from server and places corresponding markers
async function placeMarkers() {

    for (let i = 0; i < markers.length; i++) {
        markers[i].setMap(null);
        markers[i] = null;
    }

    markers = [];

    const start = document.getElementById("start-time").value;
    const end = document.getElementById("end-time").value;

    const fetchedJSON = await fetch("/list-by-date-and-coordinates?start=" + start + "&end=" + end);
    const reports = await fetchedJSON.json();

    for (let i = 0; i < reports.length; i++) {
        let latitude = parseFloat(reports[i].latitude);
        let longitude = parseFloat(reports[i].longitude);
        let location = {lat: latitude, lng: longitude};

        let marker = new google.maps.Marker({
            position: new google.maps.LatLng(location),
            map: map,
            url: '/',
            animation: google.maps.Animation.DROP,
        })

        var infoWindow = new google.maps.InfoWindow({maxWidth: 400});

        //Attach click event to the marker.
        google.maps.event.addListener(marker, "click", function (e) {
            //Wrap the content inside an HTML DIV in order to set height and width of InfoWindow.
            var description = reports[i].description;
            var contents = "<div style='font-weight: bold '>" + reports[i].title + "</div><br>";
            contents += "<div style = 'width:100%;min-height:40px'>" + description.substring(0, Math.min(100, description.length)) + "...</div>";
            contents += '<img src= "' + reports[i].imageURLs[0] + '" style = "width:100%"></a>' +
                '<div>' +
                '<a href="/details-page/details.html?entryID=' + reports[i].entryID + '">' +
                '<button >Details</button>' +
                '</a>' +
                '<button onclick = "deleteMarker(' + reports[i].entryID + ')" style="float: right">Delete</button>' +
                '</div>';
            infoWindow.setContent(contents);
            infoWindow.open(map, marker);
        })
        marker.report = reports[i];
        markers.push(marker);
    }
}

async function deleteMarker(id) {
    await fetch('/delete?' + new URLSearchParams({entryID: id}), {method: "DELETE"})
    alert("Report Deleted");
    placeMarkers();
}

function initialize() {
    fillDateTimes();
    map = createMap();
    setFocus(map);
    placeMarkers();
}

window.placeMarkers = placeMarkers;
window.deleteMarker = deleteMarker;
window.initialize = initialize

