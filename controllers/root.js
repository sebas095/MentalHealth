const Root = require('../models/root');
const Eps = require('../models/eps');
const nodemailer = require('nodemailer');
const config = require('../config/email');
const path = require('path');
const fs = require('fs');
const validateHelper = require('../helpers/validate');
const imageHelper = require('../helpers/images');
const Email = nodemailer.createTransport({service: "hotmail", auth: config.auth});
const uuid = require('uuid');
const multer = require('multer');
var upload = multer({dest: 'data/'}).single('photo');

exports.create = function(req, res) {
  if (validateHelper.validateName(req.body.names) && validateHelper.validateName(req.body.lastnames)
   && validateHelper.validateEmail(req.body.mail) && validateHelper.validatePhone(req.body.phone)
   && validateHelper.validatePwd(req.body.pwd)) {

    Root.create({
      id: uuid.v4(),
      documentType: req.body.typeDocument,
      documentNumber: req.body.numDocument,
      names: req.body.names,
      lastnames: req.body.lastnames,
      gender: req.body.gender,
      birthdate: req.body.birthdate,
      email: req.body.mail,
      phone: req.body.phone,
      address: req.body.address,
      rol: {'name': 'root', 'photo': null, 'ext': null},
      password: req.body.pwd,
      accept: 1
    }, function(err, data) {
      if (err) {
        console.log('Error: ', err);
        return res.send(500, err);
      }
      res.redirect('/');
    });
  }
  else res.redirect('/');
}

exports.allowEps = function(req, res) {
  var user = undefined;
  var userMail = undefined;

  Eps.find({
    documentNumber: req.body.numDocument,
    names: req.body.names
  }, function(err, data) {
    if (err) {
      console.log('Error: ', err);
      return res.send(500, err);
    }
    else {
      user = data[0];
      userMail = user.email;

      if (req.body.aprobarEps) {
        Eps.update(user.id, {accept: 1}, function(err, data) {
          if (err) {
            console.log('Error: ', err);
            return res.send(500, err);
          }

          Email.sendMail({
            from: req.session.admin,
            to: userMail,
            subject: "Estado de Aprobación de cuenta en MENTALHEALTH",
            html: `<p>Estimado Usuario ${user.names},</p><br><br>Su cuenta de MentalHealth` +
                  ` ha sido aprobada si deseas ingresar ve a la siguiente dirección: <a href="${req.session.url}login">Iniciar sesión</a>` +
                  `<br><br><br><br> Att,<br><br> Equipo Administrativo de MENTALHEALTH`
          });

          res.redirect('/users/' + req.session.user.id + '/' + req.session.user.rol.name + '/pending');
        });
      }

      else {
        Eps.destroy(user.id, function(err, data) {
          if (err) {
            console.log('Error: ', err);
            return res.send(500, err);
          }

          Email.sendMail({
            from: req.session.admin,
            to: userMail,
            subject: "Estado de Aprobación de cuenta en MENTALHEALTH",
            html: `<p>Estimado Usuario ${user.names},</p><br><br>Su cuenta de MentalHealth ha sido rechazada.` +
                  `<br><br><br><br> Att,<br><br> Equipo Administrativo de MENTALHEALTH`
          });

          res.redirect('/users/' + req.session.user.id + '/' + req.session.user.rol.name + '/pending');
        });
      }
    }
  });
}

exports.manage = function(req, res) {
  var allUsers = [];

  Eps.all(function(err, data) {
    if (err) {
      console.log('Error: ', err);
      return res.send(500, err);
    }
    for (var i in data) {
      if (data[i].accept >= 1) allUsers.push(data[i]);
    }
    res.render('admin/manage/root', {allUsers: allUsers});
  });
}

exports.manageProfile = function(req, res) {
  var user = req.query.requests.split('-');

  Eps.find({
    names: user[0],
    documentNumber: user[1]
  }, function(err, data) {
    if (err) {
      console.log('Error: ', err);
      return res.send(500, err);
    }
    if (req.query.editRol) {
      if (data[0].rol.photo != null) {
        imageHelper.translateImage({
          path: data[0].rol.photo,
          targetName: data[0].id + '-' + data[0].rol.name + data[0].rol.ext,
          targetPath: path.resolve(__dirname, '..', 'public/images/users/user-' + req.session.user.id),
          id: req.session.user.id
        }, function() {
          res.render('admin/manage/editRolEps', {manageRol: data[0]});
        });
      }
      else res.render('admin/manage/editRolEps', {manageRol: data[0]});
    }
    else res.render('admin/manage/edit', {manageUser: data[0]});
  });
}

exports.editRolProfile = function(req, res) {
  upload(req, res, function(err) {
    if (err) console.log('Error: ', err);
    Eps.find({
      names: req.body.nameRol,
      documentNumber: req.body.docRol
    }, function(err, data) {
      if (err) {
        console.log('Error: ', err);
        res.send(500, err);
      }

      if (req.file) {
        var user = data[0];
        var ext = path.extname(req.file.originalname);

        if (user.rol.photo == null) {
          user.rol.photo = req.file.path;
          user.rol.ext = ext;

          Eps.update(user.id, {rol: user.rol}, function(err, data) {
            if (err) {
              console.log('Error: ', err);
              res.send(500, err);
            }

            var dir = path.resolve(__dirname, '..', 'public/images/users/user-' + user.id);
            fs.exists(dir, function(exist) {
              if (exist) {
                imageHelper.translateImage({
                  path: user.rol.photo,
                  targetName: user.id + '-' + user.rol.name + user.rol.ext,
                  targetPath: path.resolve(__dirname, '..', 'public/images/users/user-' + user.id),
                  id: user.id
                }, function() {
                  req.flash('message', 'Los cambios realizados se veran reflejados cuando el usuario vuelva a iniciar sesión!');
                  res.redirect('/users/' + req.session.user.id + '/root/manage');
                });
              }
              req.flash('message', 'Los cambios realizados se veran reflejados cuando el usuario vuelva a iniciar sesión!');
              res.redirect('/users/' + req.session.user.id + '/root/manage');
            });
          });
        }

        else {
          var dirTmp = path.resolve(__dirname, '..', 'public/images/users/user-' + req.session.user.id);
          dirTmp = path.join(dirTmp, user.id + '-' + user.rol.name + user.rol.ext);

          imageHelper.deleteImage({path: dirTmp}, function() {
            var oldPath = user.rol.photo;
            user.rol.photo = req.file.path;
            user.rol.ext = ext;

            imageHelper.deleteImage({path: oldPath}, function() {
              Eps.update(user.id, {rol: user.rol}, function(err, data) {
                if (err) {
                  console.log('Error: ', err);
                  res.send(500, err);
                }

                var dirExist = path.resolve(__dirname, '..', 'public/images/users/user-' + user.id);
                dirExist = path.join(dirExist, user.id + '-' + user.rol.name + user.rol.ext);

                fs.exists(dirExist, function(exist) {
                  if (exist) {
                    imageHelper.translateImage({
                      path: user.rol.photo,
                      targetName: user.id + '-' + user.rol.name + user.rol.ext,
                      targetPath: path.resolve(__dirname, '..', 'public/images/users/user-' + user.id),
                      id: user.id
                    }, function() {
                      req.flash('message', 'Los cambios realizados se veran reflejados cuando el usuario vuelva a iniciar sesión!');
                      res.redirect('/users/' + req.session.user.id + '/root/manage');
                    });
                  }
                  req.flash('message', 'Los cambios realizados se veran reflejados cuando el usuario vuelva a iniciar sesión!');
                  res.redirect('/users/' + req.session.user.id + '/root/manage');
                });
              });
            });
          });
        }
      }
      else {
        res.redirect('/users/' + req.session.user.id + '/root/manage');
      }
    });
  });
}

exports.deleteImageProfile = function(req, res) {
  Eps.find({
    names: req.session.tmp.nameRol,
    documentNumber: req.session.tmp.docRol
  }, function(err, data) {
    if (err) {
      console.log('Error: ', err);
      res.send(500, err);
    }
    imageHelper.deleteImage({path: data[0].rol.photo}, function() {
      var dirTmp = path.resolve(__dirname, '..', 'public/images/users/user-' + req.session.user.id);
      dirTmp = path.join(dirTmp, data[0].id + '-' + data[0].rol.name + data[0].rol.ext);

      imageHelper.deleteImage({path: dirTmp}, function() {
        var dir = path.resolve(__dirname, '..', 'public/images/users/user-' + data[0].id);
        dir = path.join(dir, data[0].id + '-' + data[0].rol.name + data[0].rol.ext);

        fs.exists(dir, function(exist) {
          if (exist) {
            imageHelper.deleteImage({path: dir}, function() {
              var newRol = data[0].rol;
              newRol.photo = newRol.ext = null;

              Eps.update(data[0].id, {rol: newRol}, function(err, data) {
                if (err) {
                  console.log('Error: ', err);
                  res.send(500, err);
                }
                req.flash('message', 'Los cambios realizados se veran reflejados cuando el usuario vuelva a iniciar sesión!');
                res.redirect('/users/' + req.session.user.id + '/root/manage');
              });
            });
          }
          else {
            var newRol = data[0].rol;
            newRol.photo = newRol.ext = null;

            Eps.update(data[0].id, {rol: newRol}, function(err, data) {
              if (err) {
                console.log('Error: ', err);
                res.send(500, err);
              }
              req.flash('message', 'Los cambios realizados se veran reflejados cuando el usuario vuelva a iniciar sesión!');
              res.redirect('/users/' + req.session.user.id + '/root/manage');
            });
          }
        });
      });
    });
  });
}

exports.storeChanges = function(req, res) {
  var user = {};
  var id = req.body.ident;

  if (req.body.nit)                                                          user.documentNumber = req.body.nit;
  if (req.body.nameEps && validateHelper.validateName(req.body.nameEps))     user.names = req.body.nameEps;
  if (req.body.mailEps && validateHelper.validateEmail(req.body.mailEps))    user.email = req.body.mailEps;
  if (req.body.phoneEps && validateHelper.validatePhone(req.body.phoneEps))  user.epsPhone = req.body.phoneEps;
  if (req.body.addressEps)                                                   user.address = req.body.addressEps;
  if (req.body.typeDocument)                                                 user.documentType = req.body.typeDocument;
  if (req.body.numDocument)                                                  user.documentNumberPerson = req.body.numDocument;
  if (req.body.names && validateHelper.validateName(req.body.names))         user.namesPerson = req.body.names;
  if (req.body.lastnames && validateHelper.validateName(req.body.lastnames)) user.lastnames = req.body.lastnames;
  if (req.body.gender)                                                       user.gender = req.body.gender;
  if (req.body.phone && validateHelper.validatePhone(req.body.phone))        user.phone = req.body.phone;
  if (req.body.pwd && validateHelper.validatePwd(req.body.pwd))              user.password = req.body.pwd;
  if (req.body.state == '1')                                                 user.accept = 1;
  if (req.body.state == '2')                                                 user.accept = 2;

  Eps.update(id, user, function(err, data) {
    if (err) {
      console.log('Error: ', err);
      return res.send(500, err);
    }
    req.flash('message', 'Los cambios realizados se veran reflejados cuando el usuario vuelva a iniciar sesión!');
    res.redirect('/users/' + req.session.user.id + '/root/manage');
  });
}
