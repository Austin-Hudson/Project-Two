document.addEventListener("DOMContentLoaded", function(){
  console.log("main.js is loaded.");

  var searchBtn = document.querySelector("#search-location");
  var latitude, longitude;
  var currentLocation;
  var map;

  // URL to BE:
  var url = 'http://localhost:3000';

  searchBtn.addEventListener("click", function(){
    navigator.geolocation.getCurrentPosition(success,error)
    userInput = document.querySelector("#location-text").value;
  });

  function displayMap(response){
    currentLocation =  new google.maps.LatLng(latitude,longitude);
    map = new google.maps.Map(document.getElementById('map'), {
    center: currentLocation,
    zoom: 15
  });
    displayResults(response.results);
  }

  function displayResults(results) {
    console.log(results);
    for (var i = 0; i < results.length; i++) {
      createMarker(results[i]);
    }
  }
  function createMarker(res) {
      var marker = new google.maps.Marker({
        position: res.geometry.location,
        map: map
      })
      console.log(marker);
      // infoWindow = new google.maps.InfoWindow({
      //     content: ""
      // });
      // google.maps.event.addListener(marker, "click", function(){
      //   infoWindow.setContent(res.name + "<button type='button' id='fav'>Fav it!</button");
      //   infoWindow.open(map, this);
      //
      //   document.querySelector("#fav").addEventListener("click", function(){
      //     var location = {
      //       name: res.name,
      //       address: res.formatted_address
      //     }
      //     console.log(location);
      //     $.post('http://localhost:3000/locations', location, function(response){
      //       console.log("Response:", response);
      //     })
      //   })

      // });

    }
  function success(pos) {
    latitude = pos.coords.latitude;
    longitude = pos.coords.longitude;

    //send data BE
    var data = {
      queryString: userInput,
      lat: latitude,
      long: longitude,
      radius: '30'
    };

    $.ajax({
     url: url + '/restaurant/search',
     method: 'POST',
     data: data,
     dataType: 'json'
   }).done(function(response) {
      displayMap(response);
   }); // end ajax
  }

  function error(){
    var results = document.querySelector(".results");
    var p = document.createElement("p");
    p.innerHTML = "An error has occured.";
    results.appendChild(p);
  }
});
