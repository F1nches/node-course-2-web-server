//requre express
const express = require('express');
//requre handlebars templating engine
const hbs = require('hbs');
//require fs
const fs = require('fs');

var app = express();

hbs.registerPartials(__dirname + '/views/partials');
app.set('view engine', 'hbs');
//some middleware to keep track of how server is working and which pages are viewed
app.use((req, res, next) => {
  var now = new Date().toString();
  var log = `${now}: ${req.method} ${req.url}`;
  console.log(log);
  fs.appendFile('server.log', log + '\n', (err) => {
    if (err) {
      console.log('Unable to append to server.log');
    }
  });
  next();
});
//this middleware is for maintenance mode - no next method means nothing further down gets executed
// app.use((req, res, next) => {
//   res.render('maintenance.hbs');
// });
//some middleware here to serve up static public directory files (html, css, js files)
app.use(express.static(__dirname + '/public'));

hbs.registerHelper('getCurrentYear', () => {
  return new Date().getFullYear();
});

hbs.registerHelper('screamIt', (text) => {
  return text.toUpperCase();
});

//route handler: two arguments - first is path, second is function to run (with request and response arguments)
app.get('/', (req, res) => {
  res.render('home.hbs', {
    pageTitle: 'Home Page',
    welcomeMessage: 'Welcome to this website',
  })
});

//render a handlebars view from the views folder
app.get('/about', (req, res) => {
  res.render('about.hbs', {
    pageTitle: 'About Page',
  });
});

//error message for bad requests
app.get('/bad', (req, res) => {
  res.send({
    errorMessage: 'Unable to handle this request'
  });
})

//server port
app.listen(3000, () => {
  console.log('Server is up on port 3000');
});
