// Our scraping tools
// Axios is a promised-based http library, similar to jQuery's Ajax method
// It works on the client and on the server
var axios = require("axios");
//allows our network/ajax calls
var cheerio = require("cheerio");

// Require all models
//by default, when we do not specify file, collects index.js (whatever is exported in index.js)
var db = require("../models");

module.exports = function (app) {

  // A GET route for scraping the echoJS website
  app.get("/scrape", function (req, res) {
    // First, we grab the body of the html with axios (network calls)
    axios.get("https://www.theverge.com/tech").then(function (response) {
      // Then, we load that into cheerio and save it to $ for a shorthand selector
      var $ = cheerio.load(response.data);

      // Now, we grab every h2 within an div tag, and do the following:
      $("div h2").each(function (i, element) {
        // Save an empty result object
        var result = {};

        // Add the text and href of every link, and save them as properties of the result object
        result.title = $(this)
          .children("a")
          .text();
        console.log(result.title);

        // result.summary = $(this)
        //   .children("a")
        //   .text();
        result.link = $(this)
          .children("a")
          .attr("href");
        console.log(result.link);

        //scrape img from separate div
        $("img.c-dynamic-image").$element.attr("src")
        // Save an empty result object
        result.image = $(this)
          .attr("src");

        // Create a new Article using the `result` object built from scraping
        db.Article.create(result)
          .then(function (dbArticle) {
            // View the added result in the console
            console.log(dbArticle);
          })
          .catch(function (err) {
            // If an error occurred, log it
            console.log(err);
          });
      });

      // Send a message to the client
      res.render("index", {
        message: "Scrape Complete"
      });
    });
  });

  // Route for getting all Articles from the db
  app.get("/articles", function (req, res) {
    // TODO: Finish the route so it grabs all of the articles
    db.Article.find({}).then(function (articles) {
      console.log(articles);
      // Send a message to the client
      res.render("index", {
        articles: articles
      });
      // If an error occurred, log it
    }).catch(function (err) {
      console.log(err);
      //handles errors, throw error to frontend so the UI can display for the user
      throw new Error(err)
    })
  });


  // Route for saving a new Comment to the db and associating it with a Article
  app.post("/submit", function (req, res) {
    // Create a new Comment in the db
    db.Comment.create(req.body)
      .then(function (dbComment) {
        // If a Comment was created successfully, find one Article (there's only one) and push the new Comment's _id to the Article's `notes` array
        // { new: true } tells the query that we want it to return the updated Article -- it returns the original by default
        // Since our mongoose query returns a promise, we can chain another `.then` which receives the result of the query
        return db.Article.findOneAndUpdate({}, {
          $push: {
            notes: dbComment._id
          }
        }, {
          new: true
        });
      })
      .then(function (dbArticle) {
        // If the Article was updated successfully, send it back to the client
        res.json(dbArticle);
      })
      .catch(function (err) {
        // If an error occurs, send it back to the client
        res.json(err);
      });
  });


  // Route for grabbing a specific Article by id, populate it with it's comment
  // /articles/12345 => req.params.id = 12345
  app.get("/articles/:id", function (req, res) {
    // TODO
    // ====
    // Finish the route so it finds one article using the req.params.id,
    // and run the populate method with "comment",
    // then responds with the article with the comment included
    db.Article.findOne({
        _id: req.params.id
      })
      // Specify that we want to populate the retrieved Article with any associated comments
      .populate("comment")
      .then(function (dbArticle) {
        // If any Articles are found, send them to the client with any associated Comments
        res.json(dbArticle);
      })
      .catch(function (err) {
        // If an error occurs, send it back to the client
        res.json(err);
        // throw new Error(err.message)
      });
  });

  // Route for saving/updating an Article's associated Comment
  app.post("/articles/:id", function (req, res) {
    // TODO
    // ====
    // save the new comment that gets posted to the Comments collection
    // then find an article from the req.params.id
    // and update it's "comment" property with the _id of the new comment


    // Route for saving a new comment to the db and associating it with an article
    app.post("/submit", function (req, res) {
      // Create a new Comment in the db
      db.Comment.create(req.body)
        .then(function (dbComment) {
          // If a Comment was created successfully, find one Article (there's only one) and push the new Comment's _id to the Article's `notes` array
          // { new: true } tells the query that we want it to return the updated Article -- it returns the original by default
          // Since our mongoose query returns a promise, we can chain another `.then` which receives the result of the query
          return db.Article.findOneAndUpdate({}, {
            $push: {
              notes: dbComment._id
            }
          }, {
            new: true
          });
        })
        .then(function (dbArticle) {
          // If the Article was updated successfully, send it back to the client
          res.json(dbArticle);
        })
        .catch(function (err) {
          // If an error occurs, send it back to the client
          res.json(err);
        });
    });

  });
}