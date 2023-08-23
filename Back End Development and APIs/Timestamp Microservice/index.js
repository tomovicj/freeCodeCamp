// index.js
// where your node app starts

// init project
var express = require('express');
var app = express();

// enable CORS (https://en.wikipedia.org/wiki/Cross-origin_resource_sharing)
// so that your API is remotely testable by FCC 
var cors = require('cors');
app.use(cors({ optionsSuccessStatus: 200 }));  // some legacy browsers choke on 204

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));

// http://expressjs.com/en/starter/basic-routing.html
app.get("/", function(req, res) {
  res.sendFile(__dirname + '/views/index.html');
});


// your first API endpoint... 
app.get("/api/hello", function(req, res) {
  res.json({ greeting: 'hello API' });
});


// Timestamp Microservice

// If no time is provided, return the current time
app.get("/api", (req, res) => {
  const date = new Date();
  res.json({ "unix": date.getTime(), "utc": date.toUTCString() });
});

// If time is provided
app.get("/api/:time", (req, res, next) => {
  // Create a date object if provided time is in the valid form
  let date = new Date(req.params.time);
  if (isNaN(date)) {
    // If unix time is provided (time in milliseconds)
    // Turn the given time string to a number
    date = new Date(Number(req.params.time));
  }
  if (isNaN(date)) {
    // If provided time is in the invalid form
    res.json({"error": "Invalid Date"});
    // Ends request here. So it does not continue executing
    return next();
  }

  res.json({ "unix": date.getTime(), "utc": date.toUTCString() });
});


// listen for requests :)
var listener = app.listen(3000, function() {
  console.log('Your app is listening on port ' + listener.address().port);
});
