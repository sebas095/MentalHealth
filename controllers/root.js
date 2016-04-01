const Root = require('../models/root');
const Eps = require('../models/eps');
const nodemailer = require('nodemailer');
const config = require('../config/email');
const Email = nodemailer.createTransport({service: "hotmail", auth: config.auth});
const uuid = require('uuid');

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
