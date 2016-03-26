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
    password: req.body.pwd
  }, function(err, data) {
    if (err) {
      req.session.errors = [{"message": 'Se ha producido un error: ' + err}];
      res.redirect('/login');
      return;
    }
    if (data.length > 0) {
      req.session.user = {id: data.id, rol: data.rol};
      req.flash('message', 'Bienvenido a MentalHealth');
      res.redirect('/');
    }
    else {
      Eps.find({
        documentNumber: req.body.user,
        password: req.body.pwd
      }, function(err, data) {
        if (err) {
          req.session.errors = [{"message": 'Se ha producido un error: ' + err}];
          res.redirect('/login');
          return;
        }
        if (data.length > 0) {
          req.session.user = {id: data.id, rol: data.rol};
          req.flash('message', 'Bienvenido a MentalHealth');
          res.redirect('/');
        }
        else {
          Root.find({
            documentNumber: req.body.user,
            password: req.body.pwd
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
              req.session.user = {id: data.id, rol: data.rol};
              req.flash('message', 'Bienvenido a MentalHealth');
              console.log('LOL: ', req.session.user);
              res.redirect('/');
            }
          });
        }
      });
    }
  });
}

// DELETE /logout  -- Destruir sesion
exports.destroy = function(req, res){
	delete req.session.user;
	res.redirect((req.session.redir).toString());
};
