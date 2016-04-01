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
