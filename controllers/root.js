const Root = require('../models/root');

exports.create = function(req, res) {
  Root.create({
    documentType: ,
    documentNumber: ,
    names: ,
    lastnames: ,
    gender: ,
    birthdate: ,
    email: ,
    phone: ,
    address: ,
    rol: {'name': 'root', 'photo': null, 'ok': true},
    password:
  }, function(data) {
    if (!Object.keys(data.value).length <= 2) {
      res.status(500);
      return new Error("Root not defined");
    }
    console.log(data.value);
    res.json(data.value);
  });
}
