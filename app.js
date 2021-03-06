const express = require('express'),
      path = require('path'),
      favicon = require('static-favicon'),
      logger = require('morgan'),
      cookieParser = require('cookie-parser'),
      bodyParser = require('body-parser'),
      partials = require('express-partials'),
      session = require('express-session'),
      methodOverride = require('method-override'),
      resourceful = require('resourceful'),
      flash = require('connect-flash'),
      config = require('./config/email');

var app = express();
var urlApp = "http://judge.utp.edu.co:4000/";

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(partials());
app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser('MentalHealth'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
  secret: '094cslkvepcq61tg',
  resave: false,
  saveUninitialized: false
}));
app.use(methodOverride('_method'));
app.use(flash());

// Helpers dinamicos:
app.use(function(req, res, next){
  // Hacer visible req.session en las vistas
  res.locals.messages = require('express-messages')(req, res);
  res.locals.session = req.session;
  res.locals.session.url = urlApp || 'http://localhost:4000/';
  res.locals.session.admin = config.auth.user;
  next();
});

require('./routes')(app);
require('./routes/session')(app, '/');
require('./routes/users')(app, '/users');
require('./routes/account')(app, '/account');

/// catch 404 and forwarding to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

/// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err,
            errors: []
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {},
        errors: []
    });
});

// COnfigurando la Base de Datos
resourceful.use('couchdb', {
  host: 'localhost',
  port: '5984',
  database: 'mental_health'
});

module.exports = app;
