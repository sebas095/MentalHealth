const Root = require('../models/root');
const Eps = require('../models/eps');
const nodemailer = require('nodemailer');
const config = require('../config/email');
const path = require('path');
const fs = require('fs');
const imageHelper = require('../helpers/images');
const Email = nodemailer.createTransport({service: "hotmail", auth: config.auth});
const uuid = require('uuid');
const multer = require('multer');
var upload = multer({dest: 'data/'}).single('photo');

exports.create = function(req, res) {
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

/*
imageHelper.translateImage({
  path: req.file.path,
  targetName: req.params.id + '-' + req.params.rol + ext,
  targetPath: path.resolve(__dirname, '..', 'public/images/users/user-' + req.session.user.id),
  id: req.session.user.id
}, function() {
  res.redirect('/users/' + req.params.id + '/' + req.params.rol);
});
*/

exports.editRolProfile = function(req, res) {
  upload(req, res, function(err) {
    if (err) console.log('Error: ', err);
    if (req.file) {
      Eps.find({id: req.body.idRol}, function(err, data) {
        if (err) {
          console.log('Error: ', err);
          res.send(500, err);
        }

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

            var dir = path.resolve(__dirname, '..', 'public/images/users/user-' + data[0].id);
            fs.exists(dir, function(exist) {
              if (exist) {
                imageHelper.translateImage({
                  path: data[0].rol.photo,
                  targetName: data[0].id + '-' + data[0].rol.name + data[0].rol.ext,
                  targetPath: path.resolve(__dirname, '..', 'public/images/users/user-' + data[0].id),
                  id: data[0].id
                }, function() {
                  res.redirect('/users/' + req.session.user.id + '/root/manage');
                });
              }
              else res.redirect('/users/' + req.session.user.id + '/root/manage');
            });
          });
        }
        else {
          // falta actaulizar en public
        }
      });
    }
    else {
      res.redirect('/users/' + req.session.user.id + '/root/manage');
    }
  });
}

exports.storeChanges = function(req, res) {
  var user = {};
  var id = req.body.ident;

  if (req.body.nit)          user.documentNumber = req.body.nit;
  if (req.body.nameEps)      user.names = req.body.nameEps;
  if (req.body.mailEps)      user.email = req.body.mailEps;
  if (req.body.phoneEps)     user.epsPhone = req.body.phoneEps;
  if (req.body.addressEps)   user.address = req.body.addressEps;
  if (req.body.typeDocument) user.documentType = req.body.typeDocument;
  if (req.body.numDocument)  user.documentNumberPerson = req.body.numDocument;
  if (req.body.names)        user.namesPerson = req.body.names;
  if (req.body.lastnames)    user.lastnames = req.body.lastnames;
  if (req.body.gender)       user.gender = req.body.gender;
  if (req.body.phone)        user.phone = req.body.phone;
  if (req.body.pwd)          user.password = req.body.pwd;
  if (req.body.state == '1') user.accept = 1;
  if (req.body.state == '2') user.accept = 2;

  Eps.update(id, user, function(err, data) {
    if (err) {
      console.log('Error: ', err);
      return res.send(500, err);
    }
    res.redirect('/users/' + req.session.user.id + '/root/manage');
  });
}
