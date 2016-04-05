const Eps = require('../models/eps');
const User = require('../models/user');
const nodemailer = require('nodemailer');
const config = require('../config/email');
const Email = nodemailer.createTransport({service: "hotmail", auth: config.auth});
const uuid = require('uuid');

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

exports.manage = function(req, res) {
  var allUsers = [];

  User.all(function(err, data) {
    if (err) {
      console.log('Error: ', err);
      return res.send(500, err);
    }
    for (var i in data) {
      if (data[i].accept >= 1) allUsers.push(data[i]);
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
    else res.render('admin/manage/edit', {manageUser: data[0]});
  });
}

exports.storeChanges = function(req, res) {
  var user = {};
  var id = req.body.ident;
  //Falta actualizar roles y organizar los checkbox

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

  User.update(id, user, function(err, data) {
    if (err) {
      console.log('Error: ', err);
      return res.send(500, err);
    }
    res.redirect('/users/' + req.session.user.id + '/eps/manage');
  });
}
