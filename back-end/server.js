var express = require('express');
var cors = require('cors');
var bodyParser = require('body-parser');
var mongodb = require('mongodb');
var request = require('request');
var app = express();
var PORT = 3000;

/* let's add the ability ajax to our server from anywhere! */
app.use(cors());

/* extended:true = put it in an obj */
app.use(bodyParser.urlencoded({extended: true}));

/* marvel search */
app.post('/restaurant/search', function(req, res) {


  var baseUrl = "https://maps.googleapis.com/maps/api/place/nearbysearch/json";
  var apiKeyQueryString = "?key=";
  var GOOGLE_MAPS_API_KEY = process.env.GOOGLE_MAPS_API_KEY;
  var query = "&name=" + req.body.queryString;
  var lat = req.body.lat;
  var long = req.body.long;
  var location = "&location=" + lat + ',' + long;
  var radius = "&radius=" + req.body.radius;
  var type = "&type=restaurant";
  var fullQuery = baseUrl + apiKeyQueryString + GOOGLE_MAPS_API_KEY + query + type + radius + location;
  console.log("fullQuery:", fullQuery); // prints to terminal

  request({
    url: fullQuery,
    method: 'GET',
    callback: function(error, response, body) {
      // console.log(body);
      // console.log(response);
      res.send(body);
    }
  })

}); // end post request

/* tell our app where to listen */
app.listen(3000, function(){
  console.log('listen to events on port:', PORT);
});
