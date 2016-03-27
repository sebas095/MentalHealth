const Root = require('../models/root');
const Eps = require('../models/eps');
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
      
      if (req.body.aprobarEps) {
        Eps.update(user.id, {accept: true}, function(err, data) {
          if (err) {
            console.log('Error: ', err);
            return res.send(500, err);
          }
          res.redirect('/users/' + req.session.user.id + '/' + req.session.user.rol.name + '/pending');
        });
      }

      else {
        Eps.destroy(user.id, function(err, data) {
          if (err) {
            console.log('Error: ', err);
            return res.send(500, err);
          }
          res.redirect('/users/' + req.session.user.id + '/' + req.session.user.rol.name + '/pending');
        });
      }
    }
  });
}
