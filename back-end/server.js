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

var RESTAURANT_COLLECTION = 'restaurants';

// connect to the database server!
var url = 'mongodb://localhost:27017/food_app'
mongodb.MongoClient.connect(process.env.MONGODB_URI || url, function (err, database) {
  if (err) {
    console.log(err);
    process.exit(1);
  }

  // Save database object from the callback for reuse.
  db = database;
  console.log("Database connection ready");

  // Initialize the app. another way to start a server in express
  var server = app.listen(process.env.PORT || 3000, function () {
    var port = server.address().port;
    console.log("App now running on port", port);
  });
});

/* restaurant search */
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

app.post('/restaurants/', function(req, res) {
  var newRestaurant = req.body;

 //insert one new restaurnt
   db.collection(RESTAURANT_COLLECTION).insert(newRestaurant, function(err, doc) {
    if (err) {
      handleError(response, err.message, "Failed to add new character.");
    } else {
      res.status(201).json(doc);
    }
  });
});

// when things go wrong
function handleError(res, reason, message, code) {
  console.log("ERROR: " + reason);
  res.status(code || 500).json({"error": message});
}
