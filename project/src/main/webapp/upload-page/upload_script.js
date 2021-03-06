/**
 * @license
 * Copyright 2019 Google LLC. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */

//Creates searchable roadmap for users to click on
function initAutocomplete() {
    const map = new google.maps.Map(document.getElementById("map"), {
      center: { lat: 0, lng: 0 },
      zoom: 2,
      mapTypeId: "roadmap",
    });
    // Create the search box and link it to the UI element.
    const input = document.getElementById("pac-input");
    const searchBox = new google.maps.places.SearchBox(input);
  
    map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);
    // Bias the SearchBox results towards current map's viewport.
    map.addListener("bounds_changed", () => {
      searchBox.setBounds(map.getBounds());
    });
  
    let markers = [];
  
    // Listen for the event fired when the user selects a prediction and retrieve
    // more details for that place.
    searchBox.addListener("places_changed", () => {
      const places = searchBox.getPlaces();
  
      if (places.length == 0) {
        return;
      }
  
      // Clear out the old markers.
      markers.forEach((marker) => {
        marker.setMap(null);
      });
      markers = [];
  
      // For each place, get the icon, name and location.
      const bounds = new google.maps.LatLngBounds();
  
      places.forEach((place) => {
        if (!place.geometry || !place.geometry.location) {
          console.log("Returned place contains no geometry");
          return;
        }
  
        // Create a marker for each place.
        markers.push(
          new google.maps.Marker({
            map,
            title: place.name,
            position: place.geometry.location,
          })
        );
        if (place.geometry.viewport) {
          // Only geocodes have viewport.
          bounds.union(place.geometry.viewport);
        } else {
          bounds.extend(place.geometry.location);
        }
      });
      map.fitBounds(bounds);
    });
    
    //Creates event handling for clicking on the map -> drops a pin and updates coordinates
    map.addListener("click", (mapsMouseEvent) => {
      // Clear out the old markers.
      markers.forEach((marker) => {
        marker.setMap(null);
      });
      markers = [];
  
      // Gets coords for the user's choice
      const myJSON = JSON.stringify(mapsMouseEvent.latLng.toJSON(), null, 2);
      console.log(myJSON)

      //Then create a new marker for user's choice
      markers.push(
        new google.maps.Marker({
          map,
          title: myJSON,
          position: mapsMouseEvent.latLng,
        })
      );

      //Gets coordinate box to update with dropped pin
      var coords = document.getElementById('coordinates');
      coords.value = myJSON;
      let JSONcoords = JSON.parse(myJSON);      
      var latitude = document.getElementById('latitude');
      latitude.value = JSONcoords.lat;
      var longitude = document.getElementById('longitude');
      longitude.value = JSONcoords.lng;
    });
  }
  
  window.initAutocomplete = initAutocomplete;

