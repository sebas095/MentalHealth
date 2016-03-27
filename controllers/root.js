const Root = require('../models/root');
const Eps = require('../models/eps');
const nodemailer = require('nodemailer');
const Email = nodemailer.createTransport();
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
    rol: {'name': 'root', 'photo': null},
    password: req.body.pwd,
    accept: true
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
        Eps.update(user.id, {accept: true}, function(err, data) {
          if (err) {
            console.log('Error: ', err);
            return res.send(500, err);
          }

          Email.sendMail({
            from: req.session.user.email,
            to: userMail,
            subject: "Estado de Aprobación de cuenta en MENTALHEALTH",
            text: `Estimado Usuario ${user.names},\n\nSu cuenta de MentalHealth` +
                  ` ha sido aprobada si deseas ingresar ve a la siguiente dirección: ${req.session.url}login` +
                  `\n\n\n\n Att,\n\n Equipo Administrativo de MENTALHEALTH`
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
            from: req.session.user.email,
            to: userMail,
            subject: "Estado de Aprobación de cuenta en MENTALHEALTH",
            text: `Estimado Usuario ${user.names},\n\nSu cuenta de MentalHealth ha sido rechazada.` +
                  `\n\n\n\n Att,\n\n Equipo Administrativo de MENTALHEALTH`
          });

          res.redirect('/users/' + req.session.user.id + '/' + req.session.user.rol.name + '/pending');
        });
      }
    }
  });
}
