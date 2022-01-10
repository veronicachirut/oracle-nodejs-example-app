var mysql = require('mysql');
const port = 5000; // portul pe care sa ruleze aplicatia (localhost:5000)
const express = require("express");
const formidable = require('formidable');

// ca sa putem sa folosim ejs-uri
const app = express();
app.set("view engine", "ejs");

// ca sa putem sa folism file-urile din folderul "public" (poate contine css-uri sau js-uri)
app.use(express.static("public"));

// database configuration
var con = mysql.createConnection({
    host: "127.0.0.1",
    user: "root",
    password: "root",
    port: 3306
  });
  
// database connection
con.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");
});

// GET requests
app.get("/", function (req, res) {
    con.query("SELECT * FROM world.city", function (err, result, fields) {
      if (err) throw err;
      console.log(result);

      var cities = [];

      // se parcurge fiecare linie din rezultatul instructiunii sql pe care am rulat-o
      // in cazul de fata fiecare linie pe rand din tabelul city din schema world
      result.forEach(function (element) {

          // adaugam in vectorul tau cate un nou oras
          cities.push({
              ID: element.ID,
              name: element.Name,
              countryCode: element.CountryCode,
              district: element.District,
              population: element.Population
          });
      }, this);

      console.log("Got cities");

      console.log(cities)

      res.render("html/index", { ui_cities: cities });
    });
});

app.post("/addCity", function (req, res) {
  var form = new formidable.IncomingForm();
  
  form.parse(req, function (err, fields, files) {

    var sql = "INSERT INTO world.city (name, countryCode, district, population) " +
    "values ('" + fields.name + "', '" + fields.countryCode + "', '" + fields.district + "', " +
    fields.population + ")";

    con.query(sql, function (err, result, fields) {
      if (err) throw err;
      console.log(result);

      console.log("City successfully added!");
      res.redirect('/');
    });
  });
});

app.post("/editCity", function (req, res) {
  var form = new formidable.IncomingForm();

  form.parse(req, function (err, fields, files) {

    var sql = "UPDATE world.city " +
    "SET name = '" + fields.name + "', countryCode = '" + fields.countryCode + 
    "', district = '" + fields.district + "', population = " + fields.population +
    " WHERE ID = " + fields.id;

    con.query(sql, function (err, result, fields) {
      if (err) throw err;
      console.log(result);

      console.log("City successfully updated!");
      res.redirect('/');
    });
  });
});

// aplicatia porneste pe portul specificat la inceputul fisierului asta
app.listen(port, function(error) {
    if (error) {
        console.log("Something went wrong!", error);
    }
    else {
        console.log("Server is on port " + port);
    }
});