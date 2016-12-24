var map,placeInfoWindow;
function initMap() {
    var styles =[{"featureType":"landscape.man_made","elementType":"geometry","stylers":[{"color":"#f7f1df"}]},{"featureType":"landscape.natural","elementType":"geometry","stylers":[{"color":"#d0e3b4"}]},{"featureType":"landscape.natural.terrain","elementType":"geometry","stylers":[{"visibility":"off"}]},{"featureType":"poi","elementType":"labels","stylers":[{"visibility":"off"}]},{"featureType":"poi.business","elementType":"all","stylers":[{"visibility":"off"}]},{"featureType":"poi.medical","elementType":"geometry","stylers":[{"color":"#fbd3da"}]},{"featureType":"poi.park","elementType":"geometry","stylers":[{"color":"#bde6ab"}]},{"featureType":"road","elementType":"geometry.stroke","stylers":[{"visibility":"off"}]},{"featureType":"road","elementType":"labels","stylers":[{"visibility":"off"}]},{"featureType":"road.highway","elementType":"geometry.fill","stylers":[{"color":"#ffe15f"}]},{"featureType":"road.highway","elementType":"geometry.stroke","stylers":[{"color":"#efd151"}]},{"featureType":"road.arterial","elementType":"geometry.fill","stylers":[{"color":"#ffffff"}]},{"featureType":"road.local","elementType":"geometry.fill","stylers":[{"color":"black"}]},{"featureType":"transit.station.airport","elementType":"geometry.fill","stylers":[{"color":"#cfb2db"}]},{"featureType":"water","elementType":"geometry","stylers":[{"color":"#a2daf2"}]}];
    // Map Constructor
    map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: 22.2587, lng: 71.1924},
        zoom: 13,
        styles: styles
    });
    textSearchPlaces(locName);
    };
//Function for map error handling
mapError = () => {
    alert("Sorry we couldn't load the Map, Please hit Refresh or try after sometime")
}
//using google query request to fetch for some interesting places
function textSearchPlaces(name) {
    var bounds = map.getBounds();
    var query = "point of interest"+name ;
    var placesService = new google.maps.places.PlacesService(map);
    placesService.textSearch({
      query: query,
      bounds: bounds
    },
    function(results, status) {
        if (status === google.maps.places.PlacesServiceStatus.OK) {
            for (var i = 0; i < 15; i++) {
                markerName[i] = results[i].name;
            }
            viewModel.init();
            createMarkersForPlaces(results);
        }
        else{
            window.alert("We couldn't place Markers,Sorry for the inconvinence caused, Please Refresh the page or load after sometime");
        }
    });
};
//create markers for the fetched places--Note:code patches taken udacity Google Maps API lesson resources.
function createMarkersForPlaces(places) {
    var bounds = new google.maps.LatLngBounds();
    for (var i = 0; i < places.length; i++) {
        var place = places[i];
        var icon = {
            url: place.icon,
            size: new google.maps.Size(35, 35),
            origin: new google.maps.Point(0, 0),
            anchor: new google.maps.Point(15, 34),
            scaledSize: new google.maps.Size(25, 25)
        };
          // Create a marker for each place.
        var marker = new google.maps.Marker({
            map: map,
            icon: icon,
            title: place.name,
            position: place.geometry.location,
            animation: google.maps.Animation.DROP,
            id: place.place_id
        });
        placeInfoWindow = new google.maps.InfoWindow();
        marker.addListener('click', function() {
            getPlacesDetails(this, placeInfoWindow);
            viewModel.wikiAPI(this.title);//when click on marker call wikiAPI function defined in 'app.js'.
        });
        placeMarkers.push(marker);
        if (place.geometry.viewport) {
            bounds.union(place.geometry.viewport);
        } else {
            bounds.extend(place.geometry.location);
        }
    }
    map.fitBounds(bounds);
}
function displayInfoWindow(id){
    console.log(id);
    getPlacesDetails(placeMarkers[id],placeInfoWindow);
}
//fetch place details to be displayed on the info window--code patches taken from udacity Google API class resources
function getPlacesDetails(marker, infowindow) {
    marker.setAnimation(google.maps.Animation.BOUNCE);
    setTimeout(function () {
        marker.setAnimation(null);
    }, 2000);
    var service = new google.maps.places.PlacesService(map);
    var innerHTML;
    service.getDetails({
        placeId: marker.id
    },
    function(place, status) {
        if (status === google.maps.places.PlacesServiceStatus.OK) {
            infowindow.marker = marker;
            innerHTML = '<div class="infowindow">';
            if (place.name) {
                innerHTML += '<div class="info"><strong>' + place.name + '</strong>';
            }
            if (place.formatted_address) {
                innerHTML += '<br><p>' + place.formatted_address + '</p>';
            }
            if (place.formatted_phone_number) {
                innerHTML += '<br>' + place.formatted_phone_number;
            }
            if (place.opening_hours) {
                innerHTML += '<br><br><strong>Hours:</strong><br>' +
                place.opening_hours.weekday_text[0] + '<br>' +
                place.opening_hours.weekday_text[1] + '<br>' +
                place.opening_hours.weekday_text[2] + '<br>' +
                place.opening_hours.weekday_text[3] + '<br>' +
                place.opening_hours.weekday_text[4] + '<br>' +
                place.opening_hours.weekday_text[5] + '<br>' +
                place.opening_hours.weekday_text[6];
            }
            if (place.photos) {
                innerHTML += '<br><br><img src="' + place.photos[0].getUrl({
                    maxHeight: 100,
                    maxWidth: 200
                }) + '">';
            }
            innerHTML += '</div></div>';
            infowindow.setContent(innerHTML);
            infowindow.open(map, marker);
            infowindow.addListener('closeclick', function() {
                marker.setAnimation(null);
                infowindow.marker = null;
            });
        }
        else {
                infowindow.marker = marker;
                innerHTML = '<div class="infowindow"><div class="info"><p>Sorry we could not find more Info:</p></div></div>';
                infowindow.setContent(innerHTML);
                infowindow.open(map, marker);
                infowindow.addListener('closeclick', function() {
                    marker.setAnimation(null);
                    infowindow.marker = null;
                });
        }
    });
}