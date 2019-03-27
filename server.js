/**
* MODULE DEPENDENCIES
*/
var async = require('async');
var express = require('express');
var session = require('express-session');
var bodyParser = require('body-parser');
var routes = require('./routes');
var user = require('./routes/user');
var http = require('http');
var path = require('path');
global.bcrypt = require('bcrypt');
var mysql = require('mysql');
var app = express();
var connection = mysql.createConnection ({
  host     : 'db4free.net',
  user     : 'teampalak',
  password : 'teampalak',
  database : 'teampalak'
});
connection.connect();
global.db = connection;

app.listen(3000, function() {
  console.log("Server running on port 3000.");
});

/**
* CACHE
*/
app.use(express.static('public'));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(session({
  secret: 'somesecretkey',
  resave: false,
  saveUninitialized: true,
  cookie: { maxAge: null }
}));
app.use(express.static('./views'));
app.get('/', routes.index); //DISPLAY HOME PAGE
app.get('/login', routes.login); //DISPLAY LOGIN PAGE
app.get('/brackets', user.brackets); //DISPLAY BRACKETS PAGE
app.get('/register', routes.register); //DISPLAY SIGNUP PAGE
app.post('/register', user.register); //ADD ACCOUNT
app.post('/login', user.login); //VALIDATE LOGIN
app.post('/addAnnouncement', user.addAnnouncement);
app.post('/admin', user.admin);
app.get('/home', user.home); //call for dashboard page after login
app.get('/logout', user.logout); //call for logout
