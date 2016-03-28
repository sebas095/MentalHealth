const User = require('../models/user');
const Eps = require('../models/eps');
const Root = require('../models/root');

// MW de autorizacion de accesos HTTP retringidos
exports.loginRequired = function(req, res, next) {
  if (req.session.user) {
    next();
  }
  else res.redirect('/login');
}

// Get /login  -- Formulario de login
exports.new = function(req, res) {
  var errors = req.session.errors || {};
  req.session.errors = {};
  res.render('session/new', {errors: errors});
}

// POST /login -- Crear la sesion
exports.create = function(req, res) {
  User.find({
    documentNumber: req.body.user,
    password: req.body.pwd,
    accept: 1
  }, function(err, data) {
    if (err) {
      req.session.errors = [{"message": 'Se ha producido un error: ' + err}];
      res.redirect('/login');
      return;
    }
    if (data.length > 0) {
      req.session.user = data[0];
      req.flash('message', 'Bienvenido a MentalHealth');
      res.redirect('/users/' + req.session.user.id);
    }
    else {
      Eps.find({
        documentNumber: req.body.user,
        password: req.body.pwd,
        accept: 1
      }, function(err, data) {
        if (err) {
          req.session.errors = [{"message": 'Se ha producido un error: ' + err}];
          res.redirect('/login');
          return;
        }
        if (data.length > 0) {
          req.session.user = data[0];
          req.flash('message', 'Bienvenido a MentalHealth');
          res.redirect('/users/' + req.session.user.id);
        }
        else {
          Root.find({
            documentNumber: req.body.user,
            password: req.body.pwd,
            accept: 1
          }, function(err, data) {
            if (err) {
              req.session.errors = [{"message": 'Se ha producido un error: ' + err}];
              res.redirect('/login');
              return;
            }
            if (data.length == 0) {
              req.session.errors = [{"message": 'Los datos son incorrectos'}];
              req.flash('message', 'Datos incorrectos!');
              res.redirect('/login');
            }
            else {
              req.session.user = data[0];
              req.flash('message', 'Bienvenido a MentalHealth');
              res.redirect('/users/' + req.session.user.id);
            }
          });
        }
      });
    }
  });
}

exports.newPassword = function(req, res) {
  res.render('session/newPassword');
}

// DELETE /logout  -- Destruir sesion
exports.destroy = function(req, res){
	delete req.session.user;
	res.redirect('/');
};
