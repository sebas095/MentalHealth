const Eps = require('../models/eps');
const User = require('../models/user');
const nodemailer = require('nodemailer');
const path = require('path');
const fs = require('fs');
const config = require('../config/email');
const Email = nodemailer.createTransport({service: "hotmail", auth: config.auth});
const uuid = require('uuid');
const imageHelper = require('../helpers/images');
const multer = require('multer');
var upload = multer({dest: 'data/'}).single('photo');

exports.create = function(req, res) {
  Eps.create({
    id: uuid.v4(),
    documentNumber: req.body.nit,
    names: req.body.nameEps,
    email: req.body.mailEps,
    epsPhone: req.body.phoneEps,
    address: req.body.addressEps,
    rol: {'name': 'eps', 'photo': null, 'ext': null},
    accept: 0,
    password: req.body.pwd,
    documentType: req.body.typeDocument,
    documentNumberPerson: req.body.numDocument,
    namesPerson: req.body.names,
    lastnames: req.body.lastnames,
    gender: req.body.gender,
    phone: req.body.phone,
  }, function(err, data) {
    if (err) {
      console.log('Error: ', err);
      return res.send(500, err);
    }
    res.redirect('/');
  });
}

exports.allowUsers = function(req, res) {
  var user = undefined;
  var userMail = undefined;

  User.find({
    documentNumber: req.body.numDocument,
    names: req.body.names,
    lastnames: req.body.lastnames,
  }, function(err, data) {
    if (err) {
      console.log('Error: ', err);
      return res.send(500, err);
    }
    else {
      user = data[0];
      userMail = user.email;

      if (req.body.rechazarpaciente) {
        user = deleteRoles(user, 'paciente');
      }
      if (req.body.rechazarmedicoGeneral) {
        user = deleteRoles(user, 'medicoGeneral');
      }
      if (req.body.rechazarmedicoEspecialista) {
        user = deleteRoles(user, 'medicoEspecialista');
      }

      if (user.rol.length == 0) {
        User.destroy(user.id, function(err, data) {
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

      else if (user.rol.length > 0) {
        User.update(user.id, {accept: 1, rol: user.rol}, function(err, data) {
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
    }
  });
}

function deleteRoles(user, name) {
  var rol = user.rol;
  var index = -1;

  for (var i in rol) {
    if (rol[i].name == name) {
      index = i;
      break;
    }
  }

  if (index != -1) {
    rol.splice(index, 1);
  }

  user.rol = rol;
  return user;
}

exports.chooseRol = function(req, res) {
  User.find({
    names: req.query.names,
    documentNumber: req.query.rolNum
  }, function(err, data) {
    if (err) {
      console.log('Error: ', err);
      res.send(500, err);
    }

    var index = getIndex(data[0].rol, req.query.rolesList);
    if (data[0].rol[index].photo != null) {
      imageHelper.translateImage({
        path: data[0].rol[index].photo,
        targetName: data[0].id + '-' + data[0].rol[index].name + data[0].rol[index].ext,
        targetPath: path.resolve(__dirname, '..', 'public/images/users/user-' + req.session.user.id),
        id: req.session.user.id
      }, function() {
        res.render('admin/manage/editRolUsers', {manageRol: data[0], chosen: req.query.rolesList});
      });
    }
    else res.render('admin/manage/editRolUsers', {manageRol: data[0], chosen: req.query.rolesList});
  });
}

exports.editRolProfile = function(req, res) {
  upload(req, res, function(err) {
    if (err) console.log('Error: ', err);
    User.find({
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
        var index = getIndex(data[0].rol, req.body.currRol);

        if (user.rol[index].photo == null) {
          user.rol[index].photo = req.file.path;
          user.rol[index].ext = ext;

          User.update(user.id, {rol: user.rol}, function(err, data) {
            if (err) {
              console.log('Error: ', err);
              res.send(500, err)
            }

            var dir = path.resolve(__dirname, '..', 'public/images/users/user-' + user.id);
            fs.exists(dir, function(exist) {
              if (exist) {
                imageHelper.translateImage({
                  path: user.rol[index].photo,
                  targetName: user.id + '-' + user.rol[index].name + user.rol.ext,
                  targetName: path.resolve(__dirname, '..', 'public/users/user-' + user.id),
                  id: user.id
                }, function() {
                  res.redirect('/users/' + req.session.user.id + '/eps/manage');
                });
              }
              else {
                res.redirect('/users/' + req.session.user.id + '/eps/manage');
              }
            });
          });
        }

        else {
          var dirTmp = path.resolve(__dirname, '..', 'public/users/user-' + req.session.user.id);
          dirTmp = path.join(dirTmp, user.id + '-' + user.rol[index].name + user.rol[index].ext);

          imageHelper.deleteImage({path: dirTmp}, function() {
            var oldPath = user.rol[index].photo;
            user.rol[index].photo = req.file.path;
            user.rol[index].ext = ext;

            imageHelper.deleteImage({path: oldPath}, function() {
              User.update(user.id, {rol: user.rol}, function(err, data) {
                if (err) {
                  console.log('Error: ', err);
                  res.send(500, err);
                }

                var dirExist = path.resolve(__dirname, '..', 'public/images/users/user-' + user.id);
                dirExist = path.join(dirExist, user.id + '-' + user.rol[index].name + user.rol[index].ext);

                fs.exists(dirExist, function(exist) {
                  if (exist) {
                    imageHelper.translateImage({
                      path: user.rol[index].photo,
                      targetName: user.id + '-' + user.rol[index].name + user.rol[index].ext,
                      targetPath: path.resolve(__dirname, '..', 'public/users/user-' + user.id),
                      id: user.id
                    }, function() {
                      res.redirect('/users/' + req.session.user.id + '/eps/manage');
                    });
                  }
                  else res.redirect('/users/' + req.session.user.id + '/eps/manage');
                });
              });
            });
          });
        }
      }
      else {
        res.redirect('/users/' + req.session.user.id + '/eps/manage');
      }
    });
  });
}

exports.deleteImageProfile = function(req, res) {
  User.find({
    names: req.session.tmp2.nameRol,
    documentNumber: req.session.tmp2.docRol
  }, function(err, data) {
    if (err) {
      console.log('Error: ', err);
      res.send(500, err);
    }

    var index = getIndex(data[0].rol, req.session.tmp2.chosen);
    imageHelper.deleteImage({path: data[0].rol[index].photo}, function() {
      var dirTmp = path.resolve(__dirname, '..', 'public/images/users/user-' + req.session.user.id);
      dirTmp = path.join(dirTmp, data[0].id + '-' + data[0].rol[index].name + data[0].rol[index].ext);

      imageHelper.deleteImage({path: dirTmp}, function() {
        var dir = path.resolve(__dirname, '..', 'public/images/users/user-' + data[0].id);
        dir = path.join(dir, data[0].id + '-' + data[0].rol[index].name + data[0].rol[index].ext);

        fs.exists(dir, function(exist) {
          if (exist) {
            imageHelper.deleteImage({path: dir}, function() {
              var newRol = data[0].rol;
              newRol[index].photo = newRol[index].ext = null;

              User.update(data[0].id, {rol: newRol}, function(err, data) {
                if (err) {
                  console.log('Error: ', err);
                  res.send(500, err);
                }
                res.redirect('/users/' + req.session.user.id + '/eps/manage');
              });
            });
          }
          else {
            var newRol = data[0].rol;
            newRol[index].photo = newRol[index].ext = null;

            User.update(data[0].id, {rol: newRol}, function(err, data) {
              if (err) {
                console.log('Error: ', err);
                res.send(500, err);
              }
              res.redirect('/users/' + req.session.user.id + '/eps/manage');
            });
          }
        });
      });
    });
  });
}

exports.manage = function(req, res) {
  var allUsers = [];

  User.all(function(err, data) {
    if (err) {
      console.log('Error: ', err);
      return res.send(500, err);
    }

    for (var i in data) {
      if (data[i].accept >= 1 && (data[i].epsRelated == req.session.user.names + '-' + req.session.user.documentNumber)) {
        allUsers.push(data[i]);
      }
    }
    res.render('admin/manage/eps', {allUsers: allUsers});
  });
}

exports.manageProfile = function(req, res) {
  var user = req.query.requests.split('-');

  User.find({
    names: user[0],
    documentNumber: user[1]
  }, function(err, data) {
    if (err) {
      console.log('Error: ', err);
      return res.send(500, err);
    }
    if (req.query.editRol) res.render('admin/manage/pending', {pendingRoles: data[0]});
    if (req.query.profile) res.render('admin/manage/edit', {manageUser: data[0]});
  });
}

exports.storeChanges = function(req, res) {
  var user = {};

  if (req.body.typeDocument) user.documentType = req.body.typeDocument;
  if (req.body.numDocument)  user.documentNumber = req.body.numDocument;
  if (req.body.names)        user.names = req.body.names;
  if (req.body.lastnames)    user.lastnames = req.body.lastnames;
  if (req.body.gender)       user.gender = req.body.gender;
  if (req.body.birthdate)    user.birthdate = req.body.birthdate;
  if (req.body.mail)         user.email = req.body.mail;
  if (req.body.phone)        user.phone = req.body.phone;
  if (req.body.address)      user.address = req.body.address;
  if (req.body.epsRelated)   user.epsRelated = req.body.epsRelated;
  if (req.body.pwd)          user.password = req.body.pwd;
  if (req.body.state == '1') user.accept = 1;
  if (req.body.state == '2') user.accept = 2;

  User.find({
    names: req.body.names,
    documentNumber: req.body.documentNumber
  }, function(err, data) {
    if (err) {
      console.log('Error: ', err);
      res.send(500, err);
    }
    else {
      user.id = data[0].id;
      user.rol = data[0].rol;

      if (req.body.rechazarpaciente) {
        user = deleteRoles(user, 'paciente');
      }
      if (req.body.rechazarmedicoGeneral) {
        user = deleteRoles(user, 'medicoGeneral');
      }
      if (req.body.rechazarmedicoEspecialista) {
        user = deleteRoles(user, 'medicoEspecialista');
      }

      if (user.rol.length == 0) {
        User.destroy(user.id, function(err, data) {
          if (err) {
            console.log('Error: ', err);
            res.send(500, err);
          }
          res.redirect('/users/' + req.session.user.id + '/eps/manage');
        });
      }
      else {
        User.update(user.id, user, function(err, data) {
          if (err) {
            console.log('Error: ', err);
            return res.send(500, err);
          }
          res.redirect('/users/' + req.session.user.id + '/eps/manage');
        });
      }
    }
  });
}

function getIndex(array, match) {
  for (var i in array) {
    if (array[i].name == match) return i;
  }
  return -1;
}
