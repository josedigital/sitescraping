'use strict';

// express server
const express     = require('express');
const bodyParser  = require('body-parser');
const controllers = require('./controllers/index.controller');
const fs          = require('fs');
const path        = require('path');
const mongoose    = require('mongoose');
// const uriUtil     = require('mongodb-uri');


const app         = express();
const PORT        = process.env.PORT || 3000;

let route; // used to set routes

// connect to remote db
// later when ready to deploy to heroku

// use pug
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// serve static file
app.use(express.static('public'));
app.use('/css', express.static('public/css'));

// set routes from controllers
fs.readdirSync('./controllers').forEach( (file) => {
  if(file.substr(-3) == '.js') {
    route = require('./controllers/' + file);
    app.use(route, controllers);
  }
});

// start app
app.listen(PORT, () => {
  console.log(`app started on port ${PORT}`);
});
