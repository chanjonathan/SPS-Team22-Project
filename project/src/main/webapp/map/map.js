export function createMap() {
    // Create a new StyledMapType object, passing it an array of styles,
    // and the name to be displayed on the map type control.
    const styledMapType = new google.maps.StyledMapType(
        [
            {
                "featureType": "all",
                "elementType": "geometry",
                "stylers": [
                    {
                        "color": "#202c3e"
                    }
                ]
            },
            {
                "featureType": "all",
                "elementType": "labels.text.fill",
                "stylers": [
                    {
                        "gamma": 0.01
                    },
                    {
                        "lightness": 20
                    },
                    {
                        "weight": "1.39"
                    },
                    {
                        "color": "#ffffff"
                    }
                ]
            },
            {
                "featureType": "all",
                "elementType": "labels.text.stroke",
                "stylers": [
                    {
                        "weight": "0.96"
                    },
                    {
                        "saturation": "9"
                    },
                    {
                        "visibility": "on"
                    },
                    {
                        "color": "#000000"
                    }
                ]
            },
            {
                "featureType": "all",
                "elementType": "labels.icon",
                "stylers": [
                    {
                        "visibility": "off"
                    }
                ]
            },
            {
                "featureType": "landscape",
                "elementType": "geometry",
                "stylers": [
                    {
                        "lightness": 30
                    },
                    {
                        "saturation": "9"
                    },
                    {
                        "color": "#29446b"
                    }
                ]
            },
            {
                "featureType": "poi",
                "elementType": "geometry",
                "stylers": [
                    {
                        "saturation": 20
                    }
                ]
            },
            {
                "featureType": "poi.park",
                "elementType": "geometry",
                "stylers": [
                    {
                        "lightness": 20
                    },
                    {
                        "saturation": -20
                    }
                ]
            },
            {
                "featureType": "road",
                "elementType": "geometry",
                "stylers": [
                    {
                        "lightness": 10
                    },
                    {
                        "saturation": -30
                    }
                ]
            },
            {
                "featureType": "road",
                "elementType": "geometry.fill",
                "stylers": [
                    {
                        "color": "#193a55"
                    }
                ]
            },
            {
                "featureType": "road",
                "elementType": "geometry.stroke",
                "stylers": [
                    {
                        "saturation": 25
                    },
                    {
                        "lightness": 25
                    },
                    {
                        "weight": "0.01"
                    }
                ]
            },
            {
                "featureType": "water",
                "elementType": "all",
                "stylers": [
                    {
                        "lightness": -20
                    }
                ]
            },
        ],
        {name: "Styled Map"}
    );
    /** Creates a map and adds it to the page. */

    var map = new google.maps.Map(
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
    map.setZoom(3);

    return map;
}

export function setFocus(map) {
    function setCenter(position) {
        let location = {lat: position.coords.latitude, lng: position.coords.longitude}
        map.setCenter(location);
        map.setZoom(11);
    }
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(setCenter);
    }
}