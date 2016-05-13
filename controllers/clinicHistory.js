const User = require('../models/user');
const Calendar = require('../models/calendar');
const ClinicHistory = require('../models/clinicHistory');
const uuid = require('uuid');

exports.patients = function(req, res) {
  User.get(req.session.user.id, function(err, data) {
    if (err) {
     console.log('Error: ', err);
     return res.send(500, err);
    }

    var index = getIndex(data.rol, req.params.rol);
    var idCal = data.rol[index].idCalendar;
    
    Calendar.get(idCal, function(err, data) {
      if (err) {
        console.log('Error: ', err);
        return res.send(500, err);
      }

      var week = data.currWeek;
      var patients = [];
      var ids = getIds(week);

      User.all(function(err, data) {
        if (err) {
          console.log('Error: ', err);
          return res.send(500, err);
        }

        for (var user in data) {
          if (ids.indexOf(data[user].id) != -1) {
            patients.push(data[user]);
          }
        }

        var histories = [], tmp = [];
        ClinicHistory.all(function(err, data) {
          if (err) {
            console.log('Error: ', err);
            return res.send(500, err);
          }

          for (var i in data) {
            tmp.push(data[i].idPatient);
          }

          User.all(function(err, data) {
            if (err) {
              console.log('Error: ', err);
              return res.send(500, err);
            }

            for (var i in data) {
              if (tmp.indexOf(data[i].id) != -1) {
                histories.push(data[i].names + '-' + data[i].documentNumber);
              }
            }

            res.render('users/clinicHistory/list', {patients: patients, rol: req.params.rol, histories: histories});
          });
        });
      });
    });
  });
}

exports.new = function(req, res) {
  var user = req.query.patient.split('-');
  var names = user[0];
  var documentNumber = user[1];

  User.find({
    names: names,
    documentNumber: documentNumber
  }, function(err, data) {
    if (err) {
      console.log('Error: ', err);
      return res.send(500, err);
    }

    var user = data[0];
    ClinicHistory.find({idPatient: data[0].id}, function(err, data) {
      if (err) {
        console.log('Error: ', err);
        return res.send(500, err);
      }
      if (data.length == 0) {
        res.render('users/clinicHistory/new', {rol: req.params.rol, patient: req.query.patient, user: user, page: 1});
      }
      else {
        res.render('users/clinicHistory/new', {rol: req.params.rol, patient: req.query.patient, user: user, page: data[0].registers.length + 1});
      }
    });
  });
}

exports.chooseEdit = function(req, res) {
  var user = req.query.hist.split('-');
  var names = user[0];
  var documentNumber = user[1];

  User.find({
    names: names,
    documentNumber: documentNumber
  }, function(err, data) {
    if (err) {
      console.log('Error: ', err);
      return res.send(500, err);
    }
    res.render('users/clinicHistory/chooseEdit', {rol: req.params.rol, user: data[0]});
  });
}

exports.edit = function(req, res) {
  // Luego cambiara
  var user = req.query.hist.split('-');
  var names = user[0];
  var documentNumber = user[1];

  User.find({
    names: names,
    documentNumber: documentNumber
  }, function(err, data) {
    if (err) {
      console.log('Error: ', err);
      return res.send(500, err);
    }

    ClinicHistory.find({idPatient: data[0].id}, function(err, data) {
      if (err) {
        console.log('Error: ', err);
        return res.send(500, err);
      }
      var page = '1';//req.query.numPage;
      var history = data[0].registers[Number(page) - 1];

      res.render('users/clinicHistory/edit', {rol: req.params.rol, history: history, page: page});
    });
  });
}

exports.show = function(req, res) {
  var user = req.query.hist.split('-');
  var names = user[0];
  var documentNumber = user[1];

  User.find({
    names: names,
    documentNumber: documentNumber
  }, function(err, data) {
    if (err) {
      console.log('Error: ', err);
      return res.send(500, err);
    }
    var user = data[0];
    var idP = data[0].id;

    ClinicHistory.find({idPatient: idP}, function(err, data) {
      if (err) {
        console.log('Error: ', err);
        return res.send(500, err);
      }

      // Falta index del selct de la vista choose
      var history = data[0].registers[0];
      var page = data[0].registers.length;

      res.render('users/clinicHistory/show', {rol: req.params.rol, page: page, user: user, history: history});
    });
  });
}

exports.create = function(req, res) {
  var history = {};
  history.names = req.body.names;
  history.lastnames = req.body.lastnames;
  history.age = req.body.age;
  history.gender = req.body.gender;
  history.job = req.body.job;
  history.birthdate = req.body.birthdate;
  history.civilStatus = req.body.state;
  history.documentNumber = req.body.document;
  history.nacionality = req.body.nacion;
  history.currAddres = req.body.currAddr;
  history.pastAddress = req.body.pastAddr;
  history.educationLevel = req.body.grade;
  history.religion = req.body.religion;
  history.reasonConsultation = req.body.reasonCons;
  history.diseaseHistory = req.body.history;
  history.parentsNames = req.body.parentsNames;
  history.parentsAlive = req.body.parentsAlive;
  history.parentsDead = req.body.parentsDead;
  history.parentsReasons = req.body.parentsReasons;
  history.sibNames = req.body.sibNames;
  history.sibAlive = req.body.sibAlive;
  history.sibDead = req.body.sibDead;
  history.sibReasons = req.body.sibReasons;
  history.sonsNames = req.body.sonNames;
  history.sonsAlive = req.body.sonAlive;
  history.sonsDead = req.body.sonDead;
  history.sonsReasons = req.body.sonReasons;
  history.DBTParents = req.body.DBTParents || "";
  history.DBTParentsR = req.body.DBTParentsR;
  history.HTAParents = req.body.HTAParents || "";
  history.HTAParentsR = req.body.HTAParentsR;
  history.TBCParents = req.body.TBCParents || "";
  history.TBCParentsR = req.body.TBCParentsR;
  history.gemelarParents = req.body.gemelarParents || "";
  history.gemelarParentsR = req.body.gemelarParentsR;
  history.otherParents = req.body.otherParents || "";
  history.otherParentsR = req.body.otherParentsR;
  history.alcohol = req.body.alcohol;
  history.snuff = req.body.snuff;
  history.drugs = req.body.drugs;
  history.infusions = req.body.infusions;
  history.feeding = req.body.feeding;
  history.dipsia = req.body.dipsia;
  history.diuresia = req.body.diuresia;
  history.catarsis = req.body.catarsis;
  history.somnia = req.body.somnia;
  history.othersFis = req.body.othersFis;
  history.infancy = req.body.infancy;
  history.adult = req.body.adult;
  history.DBT = req.body.DBT || "";
  history.DBTReasons = req.body.DBTReasons;
  history.HTA = req.body.HTA || "";
  history.HTAReasons = req.body.HTAReasons;
  history.TBC = req.body.TBC || "";
  history.TBCReasons = req.body.TBCReasons;
  history.gemelar = req.body.gemelar || "";
  history.gemelarReasons = req.body.gemelarReasons;
  history.othersTr = req.body.othersTr || "";
  history.othersTrReasons = req.body.othersTrReasons;
  history.quir = req.body.quir;
  history.trauma = req.body.trauma;
  history.allergy = req.body.allergy;
  history.otherPat = req.body.otherPat;
  var user = req.body.patient.split('-');
  var names = user[0];
  var documentNumber = user[1];

  User.find({
    names: names, 
    documentNumber: documentNumber
  }, function(err, data) {
    if (err) {
      console.log('Error: ', err);
      return res.send(500, err);
    }

    var idP = data[0].id;
    ClinicHistory.find({idPatient: idP}, function(err, data) {
      if (err) {
        console.log('Error: ', err);
        return res.send(500, err);
      }

      if (data.length > 0) {
        var reg = data[0].registers;
        reg.push(history);
        
        ClinicHistory.update(data[0].id, {registers: reg}, function(err, data) {
          if (err) {
            console.log('Error: ', err);
            return res.send(500, err);
          }
          req.flash('message', 'La Historia Clínica ha sido creada éxitosamente');
          res.redirect('/users/' + req.session.user.id + '/' + req.params.rol);
        });
      }

      else {
        ClinicHistory.create({
          id: uuid.v4(),
          idPatient: idP,
          registers: [history]
        }, function(err, data) {
          if (err) {
            console.log('Error: ', err);
            return res.send(500, err);
          }
          req.flash('message', 'La Historia Clínica ha sido creada éxitosamente');
          res.redirect('/users/' + req.session.user.id + '/' + req.params.rol);
        });
      }
    });
  });
}

exports.modify = function(req, res) {
  var index = Number(req.body.page) - 1;
  var history = {};
  history.names = req.body.names;
  history.lastnames = req.body.lastnames;
  history.age = req.body.age;
  history.gender = req.body.gender;
  history.job = req.body.job;
  history.birthdate = req.body.birthdate;
  history.civilStatus = req.body.state;
  history.documentNumber = req.body.document;
  history.nacionality = req.body.nacion;
  history.currAddres = req.body.currAddr;
  history.pastAddress = req.body.pastAddr;
  history.educationLevel = req.body.grade;
  history.religion = req.body.religion;
  history.reasonConsultation = req.body.reasonCons;
  history.diseaseHistory = req.body.history;
  history.parentsNames = req.body.parentsNames;
  history.parentsAlive = req.body.parentsAlive;
  history.parentsDead = req.body.parentsDead;
  history.parentsReasons = req.body.parentsReasons;
  history.sibNames = req.body.sibNames;
  history.sibAlive = req.body.sibAlive;
  history.sibDead = req.body.sibDead;
  history.sibReasons = req.body.sibReasons;
  history.sonsNames = req.body.sonNames;
  history.sonsAlive = req.body.sonAlive;
  history.sonsDead = req.body.sonDead;
  history.sonsReasons = req.body.sonReasons;
  history.DBTParents = req.body.DBTParents || "";
  history.DBTParentsR = req.body.DBTParentsR;
  history.HTAParents = req.body.HTAParents || "";
  history.HTAParentsR = req.body.HTAParentsR;
  history.TBCParents = req.body.TBCParents || "";
  history.TBCParentsR = req.body.TBCParentsR;
  history.gemelarParents = req.body.gemelarParents || "";
  history.gemelarParentsR = req.body.gemelarParentsR;
  history.otherParents = req.body.otherParents || "";
  history.otherParentsR = req.body.otherParentsR;
  history.alcohol = req.body.alcohol;
  history.snuff = req.body.snuff;
  history.drugs = req.body.drugs;
  history.infusions = req.body.infusions;
  history.feeding = req.body.feeding;
  history.dipsia = req.body.dipsia;
  history.diuresia = req.body.diuresia;
  history.catarsis = req.body.catarsis;
  history.somnia = req.body.somnia;
  history.othersFis = req.body.othersFis;
  history.infancy = req.body.infancy;
  history.adult = req.body.adult;
  history.DBT = req.body.DBT || "";
  history.DBTReasons = req.body.DBTReasons;
  history.HTA = req.body.HTA || "";
  history.HTAReasons = req.body.HTAReasons;
  history.TBC = req.body.TBC || "";
  history.TBCReasons = req.body.TBCReasons;
  history.gemelar = req.body.gemelar || "";
  history.gemelarReasons = req.body.gemelarReasons;
  history.othersTr = req.body.othersTr || "";
  history.othersTrReasons = req.body.othersTrReasons;
  history.quir = req.body.quir;
  history.trauma = req.body.trauma;
  history.allergy = req.body.allergy;
  history.otherPat = req.body.otherPat;

  User.find({
    names: history.names,
    documentNumber: history.documentNumber
  }, function(err, data) {
    if (err) {
      console.log('Error: ', err);
      return res.send(500, err);
    }

    var idP = data[0].id;
    ClinicHistory.find({idPatient: idP}, function(err, data) {
      if (err) {
        console.log('Error: ', err);
        return res.send(500, err);
      }

      var idClinicH = data[0].id;
      var newHistory = data[0].registers;
      newHistory[index] = history;

      ClinicHistory.update(idClinicH, {registers: newHistory}, function(err, data) {
        if (err) {
          console.log('Error: ', err);
          return res.send(500, err);
        }
        req.flash('message', 'La Historia Clínica ha sido modificada éxitosamente');
        res.redirect('/users/' + req.session.user.id + '/' + req.params.rol);
      });
    });
  });
}

function getIndex(array, match) {
  for (var i in array) {
    if (array[i].name == match) return i;
  }
  return -1;
}

function getIds(week) {
  var days = Object.keys(week);
  var ids = [];

  for (var i in days) {
    for (var j in week[days[i]]) {
      if (week[days[i]][j].idPatient) {
        ids.push(week[days[i]][j].idPatient);
      }
    }
  }

  return ids;
}