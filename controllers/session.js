const User = require('../models/user');
const Eps = require('../models/eps');
const Root = require('../models/root');
const path = require('path');
const imageHelper = require('../helpers/images');
const nodemailer = require('nodemailer');
const config = require('../config/email');
const fs = require('fs-extra');
const Email = nodemailer.createTransport({service: "hotmail", auth: config.auth});

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

  if (req.session.user) {
    destroyUserImages(function() {
      delete req.session.user;
      req.session.rolEdit = undefined;
      res.render('session/new', {errors: errors});
    });
  }

   else {
    req.session.rolEdit = undefined;
    res.render('session/new', {errors: errors});
   }
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
      var rol = (Array.isArray(data[0].rol))?  data[0].rol[0].name : data[0].rol.name;
      req.session.user = data[0];
      req.flash('message', 'Bienvenido a MentalHealth');
      userImages(req, res, function() {
        res.redirect('/users/' + req.session.user.id + '/' + rol);
      });
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
          var rol = (Array.isArray(data[0].rol))?  data[0].rol[0].name : data[0].rol.name;
          req.session.user = data[0];
          req.flash('message', 'Bienvenido a MentalHealth');
          userImages(req, res, function() {
            res.redirect('/users/' + req.session.user.id + '/' + rol);
          });
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
              var rol = (Array.isArray(data[0].rol))?  data[0].rol[0].name : data[0].rol.name;
              req.session.user = data[0];
              req.flash('message', 'Bienvenido a MentalHealth');
              userImages(req, res, function() {
                res.redirect('/users/' + req.session.user.id + '/' + rol);
              });
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

exports.recovery = function(req, res) {
  res.render('session/recovery');
}

exports.changePassword = function(req, res) {
  var user = undefined;

  User.find({documentNumber: req.body.user}, function(err, data) {
    if (err) {
      console.log('Error: ', err);
      res.send(500, err);
    }
    if (data.length > 0) {
      user = data[0];
      User.update(user.id, {password: req.body.pwd}, function(err, data) {
        if (err) {
          console.log('Error: ', err);
          res.send(500, err);
        }
        res.redirect('/login');
      });
    }
    else {
      Eps.find({documentNumber: req.body.user}, function(err, data) {
        if (err) {
          console.log('Error: ', err);
          res.send(500, err);
        }
        if (data.length > 0) {
          user = data[0];
          Eps.update(user.id, {password: req.body.pwd}, function(err, data) {
            if (err) {
              console.log('Error: ', err);
              res.send(500, err);
            }
            res.redirect('/login');
          });
        }
        else {
          Root.find({documentNumber: req.body.user}, function(err, data) {
            if (err) {
              console.log('Error: ', err);
              res.send(500, err);
            }
            if (data.length == 0) {
              res.redirect('/');
            }
            else {
              user = data[0];
              Root.update(user.id, {password: req.body.pwd}, function(err, data) {
                if (err) {
                  console.log('Error: ', err);
                  res.send(500, err);
                }
                res.redirect('/');
              });
            }
          });
        }
      });
    }
  });
}

exports.request = function(req, res) {
  var user = req.query.user;

  User.find({documentNumber: user}, function(err, data) {
    if (err) {
      console.log('Error: ', err);
      res.send(500, err);
    }
    if (data.length > 0) {
      Email.sendMail({
        from: req.session.admin,
        to: data[0].email,
        subject: "Recuperación de contraseña en MENTALHEALTH",
        html: `<p>Estimado Usuario ${data[0].names},</p><br><br>Para una nueva contraseña en su cuenta de MentalHealth` +
              ` deberas acceder a la siguiente dirección: <a href="${req.session.url}account/newPassword">Recuperar Contraseña</a>` +
              `<br><br><br><br> Att,<br><br> Equipo Administrativo de MENTALHEALTH`
      });
      res.redirect('/');
    }
    else {
      Eps.find({documentNumber: user}, function(err, data) {
        if (err) {
          console.log('Error: ', err);
          res.send(500, err);
        }
        if (data.length > 0) {
          Email.sendMail({
            from: req.session.admin,
            to: data[0].email,
            subject: "Recuperación de contraseña en MENTALHEALTH",
            html: `<p>Estimado Usuario ${data[0].names},</p><br><br>Para una nueva contraseña en su cuenta de MentalHealth` +
                  ` deberas acceder a la siguiente dirección: <a href="${req.session.url}account/newPassword">Recuperar Contraseña</a>` +
                  `<br><br><br><br> Att,<br><br> Equipo Administrativo de MENTALHEALTH`
          });
          res.redirect('/');
        }
        else {
          Root.find({documentNumber: user}, function(err, data) {
            if (err) {
              console.log('Error: ', err);
              res.send(500, err);
            }
            if (data.length == 0) {
              res.redirect('/');
            }
            else {
              Email.sendMail({
                from: req.session.admin,
                to: data[0].email,
                subject: "Recuperación de contraseña en MENTALHEALTH",
                html: `<p>Estimado Usuario ${data[0].names},</p><br><br> Para una nueva contraseña en su cuenta de MentalHealth` +
                      ` deberas acceder a la siguiente dirección: <a href="${req.session.url}account/newPassword">Recuperar Contraseña</a>` +
                      `<br><br><br><br> Att,<br><br> Equipo Administrativo de MENTALHEALTH`
              });
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
  destroyUserImages(function() {
    delete req.session.user;
    req.session.rolEdit = undefined;
    res.redirect('/');
  });
};

// Mover imagenes del server a la carpeta public
function userImages(req, res, callback) {
  if (Array.isArray(req.session.user.rol)) {
    if (req.session.user.rol.length == 1) {
      if (req.session.user.rol[0].photo != null) {
        imageHelper.translateImage({
          path: req.session.user.rol[0].photo,
          targetName: req.session.user.id + '-' + req.session.user.rol[0].name + req.session.user.rol[0].ext,
          targetPath: path.resolve(__dirname, '..', 'public/images/tmp')
        }, callback);
      }
      else callback();
    }

    if (req.session.user.rol.length == 2) {
      if (req.session.user.rol[0].photo == null && req.session.user.rol[1].photo != null) {
        imageHelper.translateImage({
          path: req.session.user.rol[1].photo,
          targetName: req.session.user.id + '-' + req.session.user.rol[1].name + req.session.user.rol[1].ext,
          targetPath: path.resolve(__dirname, '..', 'public/images/tmp')
        }, callback);
      }
      if (req.session.user.rol[1].photo == null && req.session.user.rol[0].photo != null) {
        imageHelper.translateImage({
          path: req.session.user.rol[0].photo,
          targetName: req.session.user.id + '-' + req.session.user.rol[0].name + req.session.user.rol[0].ext,
          targetPath: path.resolve(__dirname, '..', 'public/images/tmp')
        }, callback);
      }
      if (req.session.user.rol[0].photo != null && req.session.user.rol[1].photo != null) {
        imageHelper.translateImage({
          path: req.session.user.rol[0].photo,
          targetName: req.session.user.id + '-' + req.session.user.rol[0].name + req.session.user.rol[0].ext,
          targetPath: path.resolve(__dirname, '..', 'public/images/tmp')
        }, function() {
          imageHelper.translateImage({
            path: req.session.user.rol[1].photo,
            targetName: req.session.user.id + '-' + req.session.user.rol[1].name + req.session.user.rol[1].ext,
            targetPath: path.resolve(__dirname, '..', 'public/images/tmp')
          }, callback);
        });
      }
      else callback();
    }

    if (req.session.user.rol.length == 3) {
      if (req.session.user.rol[0].photo != null && req.session.user.rol[1].photo == null && req.session.user.rol[2].photo == null) {
        imageHelper.translateImage({
          path: req.session.user.rol[0].photo,
          targetName: req.session.user.id + '-' + req.session.user.rol[0].name + req.session.user.rol[0].ext,
          targetPath: path.resolve(__dirname, '..', 'public/images/tmp')
        }, callback);
      }
      if (req.session.user.rol[1].photo != null && req.session.user.rol[0].photo == null && req.session.user.rol[2].photo == null) {
        imageHelper.translateImage({
          path: req.session.user.rol[1].photo,
          targetName: req.session.user.id + '-' + req.session.user.rol[1].name + req.session.user.rol[1].ext,
          targetPath: path.resolve(__dirname, '..', 'public/images/tmp')
        }, callback);
      }
      if (req.session.user.rol[2].photo != null && req.session.user.rol[1].photo == null && req.session.user.rol[0].photo == null) {
        imageHelper.translateImage({
          path: req.session.user.rol[2].photo,
          targetName: req.session.user.id + '-' + req.session.user.rol[2].name + req.session.user.rol[2].ext,
          targetPath: path.resolve(__dirname, '..', 'public/images/tmp')
        }, callback);
      }
      if (req.session.user.rol[0].photo != null && req.session.user.rol[1].photo != null && req.session.user.rol[2].photo == null) {
        imageHelper.translateImage({
          path: req.session.user.rol[0].photo,
          targetName: req.session.user.id + '-' + req.session.user.rol[0].name + req.session.user.rol[0].ext,
          targetPath: path.resolve(__dirname, '..', 'public/images/tmp')
        }, function() {
          imageHelper.translateImage({
            path: req.session.user.rol[1].photo,
            targetName: req.session.user.id + '-' + req.session.user.rol[1].name + req.session.user.rol[1].ext,
            targetPath: path.resolve(__dirname, '..', 'public/images/tmp')
          }, callback);
        });
      }
      if (req.session.user.rol[0].photo != null && req.session.user.rol[2].photo != null && req.session.user.rol[1].photo == null) {
        imageHelper.translateImage({
          path: req.session.user.rol[0].photo,
          targetName: req.session.user.id + '-' + req.session.user.rol[0].name + req.session.user.rol[0].ext,
          targetPath: path.resolve(__dirname, '..', 'public/images/tmp')
        }, function() {
          imageHelper.translateImage({
            path: req.session.user.rol[2].photo,
            targetName: req.session.user.id + '-' + req.session.user.rol[2].name + req.session.user.rol[2].ext,
            targetPath: path.resolve(__dirname, '..', 'public/images/tmp')
          }, callback);
        });
      }
      if (req.session.user.rol[1].photo != null && req.session.user.rol[2].photo != null && req.session.user.rol[0].photo == null) {
        imageHelper.translateImage({
          path: req.session.user.rol[1].photo,
          targetName: req.session.user.id + '-' + req.session.user.rol[1].name + req.session.user.rol[1].ext,
          targetPath: path.resolve(__dirname, '..', 'public/images/tmp')
        }, function() {
          imageHelper.translateImage({
            path: req.session.user.rol[2].photo,
            targetName: req.session.user.id + '-' + req.session.user.rol[2].name + req.session.user.rol[2].ext,
            targetPath: path.resolve(__dirname, '..', 'public/images/tmp')
          }, callback);
        });
      }
      if (req.session.user.rol[0].photo != null && req.session.user.rol[1].photo != null && req.session.user.rol[2].photo != null) {
        imageHelper.translateImage({
          path: req.session.user.rol[0].photo,
          targetName: req.session.user.id + '-' + req.session.user.rol[0].name + req.session.user.rol[0].ext,
          targetPath: path.resolve(__dirname, '..', 'public/images/tmp')
        }, function() {
          imageHelper.translateImage({
            path: req.session.user.rol[1].photo,
            targetName: req.session.user.id + '-' + req.session.user.rol[1].name + req.session.user.rol[1].ext,
            targetPath: path.resolve(__dirname, '..', 'public/images/tmp')
          }, function() {
            imageHelper.translateImage({
              path: req.session.user.rol[2].photo,
              targetName: req.session.user.id + '-' + req.session.user.rol[2].name + req.session.user.rol[2].ext,
              targetPath: path.resolve(__dirname, '..', 'public/images/tmp')
            }, callback);
          });
        });
      }
      else callback();
    }
  }

  else {
    if (req.session.user.rol.photo != null) {
      imageHelper.translateImage({
        path: req.session.user.rol.photo,
        targetName: req.session.user.id + '-' + req.session.user.rol.name + req.session.user.rol.ext,
        targetPath: path.resolve(__dirname, '..', 'public/images/tmp')
      }, callback);
    }
    else callback();
  }
}

// Borrar las imagenes del perfil que estan en la carpeta public al cerrar la sesion
function destroyUserImages(callback) {
  fs.remove(path.resolve(__dirname, '..', 'public/images/tmp'), function(err) {
    if (err) console.log("Error: ", err);
    callback();
  });
}
