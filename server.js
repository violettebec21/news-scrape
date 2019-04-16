var express = require("express");
//express here is node middleware
var logger = require("morgan");
var mongoose = require("mongoose");
//mongoose is our mongo ORM

var PORT = process.env.PORT || 3000;


// Initialize Express
var app = express();

// Configure middleware

// Use morgan logger for logging requests
app.use(logger("dev"));
// Parse request body as JSON (lines 30 & 31)
  //req.body -> body parser allows this breakout
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Set Handlebars.
//import handlebars from npm package
var exphbs = require("express-handlebars");

//set view engine
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

// Make public a static folder
  //setting static directory/"starting point"
app.use(express.static("public"));

// Connect to the Mongo DB
mongoose.connect("mongodb://localhost/becnews", { useNewUrlParser: true });

// Routes
require("./routes/apiRoutes")(app);
require("./routes/htmlRoutes")(app);

// Start the server
app.listen(PORT, function() {
  console.log("App running on port " + PORT + "!");
});
