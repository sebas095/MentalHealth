const User = require('../models/user');

exports.create = function(req, res) {
  User.create({
    documentType: ,
    documentNumber: ,
    names: ,
    lastnames: ,
    gender: ,
    birthdate: ,
    email: ,
    phone: ,
    address: ,
    epsRelated: ,
    roles: ,
    password: ,
    accept: false
  }, function(data) {
    if (!Object.keys(data.value).length <= 2) {
      res.status(500);
      return new Error("User not defined");
    }
    console.log(data.value);
    res.json(data.value);
  });
}
