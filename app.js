/* eslint-disable no-undef */
/* eslint-disable linebreak-style */
const express = require('express');// List of requirements//
const chalk = require('chalk');// allows us to set colors on error messages and console messages//
const debug = require('debug')('app');// We must tell debug where to install and run npm i debug//
const morgan = require('morgan');// log messages to the console concerning web traffic
const path = require('path');// deals with cross platform concatenation of directory names
const sql = require('mssql'); // Microsoft SQL server client for Node.js

// Port number. Select between process env port or 5000
const port = process.env.PORT || 5000;
const app = express();
     
const config = {
  user: 'dortiz', // username set for db
  password: 'M@nch3stercity', //password set for db
  server: 'dortizserver.database.windows.net', // You can use 'localhost\\instance' to connect to named instance or get servername
  database: 'PSLibrary',

  options: {
    encrypt: true // Use this if you're on Windows Azure
  }
};

sql.connect(config).catch((err)=> debug(err)); //connect and use .catch to catch any errors and use debug to throw out

app.use(morgan('tiny')); // diminishes the message log to show relevant information
app.use(express.static(path.join(__dirname, '/public/'))); // sets up a static directory for static files

app.use('/css', express.static(path.join(__dirname, '/vendor/bootstrap/css')));
app.use('/js', express.static(path.join(__dirname, '/vendor/jquery')));
app.use('/css', express.static(path.join(__dirname, '/node_modules/bootstrap/dist/css'))); // obtain bootstrap css file directly from node modules.
// It will look in public first and in node_modules.
app.use('/js', express.static(path.join(__dirname, '/node_modules/bootstrap/dist/js')));
app.use('/js', express.static(path.join(__dirname, '/node_modules/jquery/dist/js'))); // jquery file that bootstrap needs
app.set('views', './src/views'); // sets a views directory for our templating engine
app.set('view engine', 'ejs'); // express will start to look a package called pug and sets it as template engine

const nav = [{ title: 'Books', link: '/books' }, { title: 'Authors', link: '/authors' }];

const bookRouter = require('./src/routes/bookRoutes')(nav); // requiring from routes folder also passing nav as part of the configuration data

app.use('/books', bookRouter); // tell app to use the router to create chainable route handlers after /books
app.get('/', (req, res) => {
  res.render('index', { nav, title: 'Library' }); // We can pass down variables to render into the page and use them in index.pug
});

app.listen(port, () => {
  debug(`Server on, listening at port: ${chalk.bgCyanBright(port)}`); // to run in debug mode fore message to appear run DEBUG=* (nodemon/nod) app.js
  // you can also just do app instead * to not include express debug messages
});

// const trou = 2; eslint will catch problems like this an initialized variable without being called
// you can use eslint to fix issues automatically using eslint "app.js --fix"
