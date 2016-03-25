const Eps = require('../models/eps');

exports.create = function(req, res) {
  Eps.create({
    nit: ,
    epsName: ,
    email: ,
    epsPhone: ,
    address: ,
    rol: {'name': 'eps', 'photo': null, 'ok': false},
    accept: false,
    password: ,
    documentType: ,
    documentNumber: ,
    names: ,
    lastnames: ,
    gender: ,
    phone: ,
  }, function(data) {
    if (!Object.keys(data.value).length <= 2) {
      res.status(500);
      return new Error("Eps not defined");
    }
    console.log(data.value);
    res.json(data.value);
  });
}
