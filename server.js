// Dependencies and app initilization
var express    = require('express');
var mongoose   = require('mongoose');
var bodyParser = require('body-parser');
var app        = express();

// Was the server port set at the environment level?
// If so, use it. Otherwise 8675 (*three oh niiiine*)
var port = process.env.port || 8675;

// Setup the JSON body parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
	extended: true
}));

// Routes
var routeIndex = require('./routes/index');
var routeUser  = require('./routes/user');

app.use('/',     routeIndex);
app.use('/user', routeUser);

// Connect to Mongo
mongoose.connect('mongodb://localhost/demoApp', function(error) {

	if (error) {
		console.log("Couldn't start API, database error: " + error);
	} else {

		// Mongo connection succeeded, start the app
		app.listen(port);
		console.log("Running!");
	}

});

