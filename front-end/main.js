document.addEventListener("DOMContentLoaded", function(){
  console.log("main.js is loaded.");

  var searchBtn = document.querySelector("#search-location");
  var commentBtn = document.querySelector("#comment-btn");
  var panel = document.querySelector("#panel");
  var latitude, longitude;
  var currentLocation;
  var map;

  // URL to BE:
  var url = 'http://localhost:3000';

  searchBtn.addEventListener("click", function(){
    navigator.geolocation.getCurrentPosition(success,error)
    userInput = document.querySelector("#location-text").value;
  });

  commentBtn.addEventListener("click", function(){
           $("#panel").slideUp("slow");
    // navigator.geolocation.getCurrentPosition(success,error)
    // userInput = document.querySelector("#location-text").value;
  });

  function displayMap(response){
    currentLocation =  new google.maps.LatLng(latitude,longitude);
    map = new google.maps.Map(document.getElementById('map'), {
    center: currentLocation,
    zoom: 15
  });
    displayResults(response.results);
    console.log(response);
  }

  function displayResults(results) {
    for (var i = 0; i < results.length; i++) {
      createMarker(results[i]);
    }
  }
  function createMarker(res) {
      var marker = new google.maps.Marker({
        position: res.geometry.location,
        map: map
      })
      infoWindow = new google.maps.InfoWindow({
          content: ""
      });
      google.maps.event.addListener(marker, "click", function(){
        infoWindow.setContent(res.name +  "<button type='button' id='comment'>Comment!</button");
        infoWindow.open(map, this);

        //TO DO FIGURE OUT HOW TO DO FILE UPLOAD
        document.querySelector("#comment").addEventListener("click", function(){
          var restaurant = {
            name: res.name,
            address: res.vicinity,
            rating: res.rating,
            comments: []
          }
            //populate the panel with data
            var restName = document.querySelector("#restaurant-name");
            var address = document.querySelector("#address");
            var rating = document.querySelector("#rating");
            restName.innerHTML = restaurant.name;
            address.innerHTML = restaurant.address;
            rating.innerHTML = restaurant.rating;

            //animate so the panels move
            $(panel).slideDown("slow")

            //push comment
            var commentBtn = document.querySelector("#comment-btn");

            commentBtn.addEventListener("click", function(){

              restaurant["comments"].push(document.querySelector("#comment-area").value);

              $.post('http://localhost:3000/restaurants', restaurant, function(response){
                console.log("Response:", response);
              })

            });

        })

      });

    }

  function success(pos) {
    latitude = pos.coords.latitude;
    longitude = pos.coords.longitude;

    //send data BE
    var data = {
      queryString: userInput,
      lat: latitude,
      long: longitude,
      radius: '500'
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
