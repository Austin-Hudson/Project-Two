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


  /*
    After speaking with Harry Hur, reading the AWS S3 Docs and looking at tutorials
    these are the sources I used within the back and front-end

    http://stackoverflow.com/questions/34407858/how-to-send-a-file-to-nodejs-using-formdata-and-have-node-send-back-a-confirmati

    https://www.linux.com/learn/how-manage-amazon-s3-files-your-server-side-code

    http://www.joshsgman.com/upload-to-and-get-images-from-amazon-s3-with-node-js/
  */

  $("#upload-form").on("submit", function(e){
    e.preventDefault(); //prevent refresh
    var formData = new FormData(this);
    console.log(url + $(this).attr("action"));
    $.ajax({
       type: "POST",
       url: url + $(this).attr("action"),
       data: formData,
       cache: false,
       contentType: false,
       processData: false,
       success: function(data) {
           console.log("image has been saved: ", data);
       },
       error: function (data) {
           console.error("error: ", data);
       }
   });
  })

  searchBtn.addEventListener("click", function(){
    userInput = document.querySelector("#location-text").value;
    if(userInput != null || userInput != undefined){
        navigator.geolocation.getCurrentPosition(success,error)
    }
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

            //get images to display
            $.ajax({
              url: 'http://localhost:3000/restaurants/img',
              dataType: 'json'
            }).done(function(data){
              //console.log(data);
              displayImages(data);
            });

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

  function displayImages(data){
    console.log(data);
    // 1. Initialize fotorama manually.
    var fotorama = document.querySelector(".fotorama");
    for(var i = 0; i < data.urls.length; i++){
      var img = document.createElement("img");
      img.src = data.urls[i];
      fotorama.appendChild(img);
    }

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
