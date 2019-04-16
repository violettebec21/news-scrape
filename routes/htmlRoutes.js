//this file handles sending the info back to HTML
// ===============================================================================
// ROUTING
// ===============================================================================

module.exports = function (app) {
  // HTML GET Requests
  // Below code handles when users "visit" a page.
  // In each of the below cases the user is shown an HTML page of content
  //using "dirname" so files are more manageable if we change anything moving forward, more flexible
  // ---------------------------------------------------------------------------

  app.get("/", function (req, res) {
    res.render("index");
  });

//   app.get("/survey", function (req, res) {
//     res.sendFile(path.join(__dirname, "../public/survey.html"));
//   });

//   // If no matching route is found default to home
//   //wildcard || asterisk allows for any file
//   app.get("*", function (req, res) {
//     res.sendFile(path.join(__dirname, "../public/home.html"));
//   });
};