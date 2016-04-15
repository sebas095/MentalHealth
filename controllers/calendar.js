const User = require('../models/user');
const Calendar = require('../models/calendar');
const uuid = require('uuid');

exports.home = function(req, res) {
  if (req.params.rol == 'paciente') {
    var user = req.query.medicos.split('-');

    User.find({
      names: user[0],
      documentNumber: user[1]
    }, function(err, data) {
      if (err) {
        console.log('Error: ', err);
        res.send(500, err);
      }

      var medico = data[0]
      var index = getIndex(data[0].rol, req.query.currMedic);
      var idCal = data[0].rol[index].idCalendar;

      Calendar.get(idCal, function(err, data) {
        if (err) {
          console.log('Error: ', err);
          res.send(500, err);
        }
        var newWeek = transform(data.currWeek);
        var flag = isEmpty(data.currWeek);

        res.render('users/calendar/paciente', {
          calMedico: newWeek.newWeek,
          hourRow: newWeek.hours,
          medico: medico,
          length: data.currWeek['lunes'].length,
          empty: flag
        });
      });
    });
  }
  else {
    res.render('users/calendar/medicos', {medico: req.params.rol, times: req.query.times});
  }
}

exports.pending = function(req, res) {
  var eps = req.session.user.epsRelated;
  var generales = [];
  var especialistas = [];

  User.find({epsRelated: eps}, function(err, data) {
    if (err) {
      console.log('Error: ', err);
      res.send(500, err);
    }
    for (var user in data) {
      if (data[user].id != req.session.user.id) {
        var index1 = getIndex(data[user].rol, 'medicoGeneral');
        var index2 = getIndex(data[user].rol, 'medicoEspecialista');
        if (index1 != -1) {
          generales.push(data[user]);
        }
        if (index2 != -1) {
          especialistas.push(data[user]);
        }
      }
    }
    res.render('users/calendar/index', {generales: generales, especialistas: especialistas});
  });
}

exports.initTime = function(req, res) {
  var index = getIndex(req.session.user.rol, req.params.rol);
  var idCal = req.session.user.rol[index].idCalendar;

  Calendar.get(idCal, function(err, data) {
    if (err) {
      console.log('Error: ', err);
      res.send(500, err);
    }
    var week = data.currWeek;
    if (isEmpty(week)) {
      res.render('users/calendar/initTime', {medico: req.params.rol, empty: true});
    }
    else res.render('users/calendar/initTime', {medico: req.params.rol, empty: false});
  });
}

exports.saveChanges = function(req, res) {
  var index = getIndex(req.session.user.rol, req.params.rol);
  var idCal = req.session.user.rol[index].idCalendar;
  var limit = Number(req.body.numRow);
  var init = req.body.init.split(' ');
  var am = init[1];
  var initH = Number(init[0].split(':')[0]);
  var hours = [];
  var flag1 = (am == 'a.m');
  var week = {};
  var days = ["lunes", "martes", "miercoles", "jueves", "viernes", "sabado"];

  for (var i = 0; i < limit; i++) {
    var h = initH + i;
    if (h >= 12) flag1 = false;
    if (h == 1) continue;

    var tmp = (flag1)? 'a.m' : 'p.m';
    h = (h > 12)? h % 12 : h;
    hours.push(h + ':00 ' + tmp);
  }

  for (var day in days) {
    var arr = [];
    for (var i in hours) {
      var json = {};
      json.hour = hours[i];
      json.color = "background: #9e9e9e";
      arr.push(json);
    }
    week[days[day]] = arr;
  }

  var weekForm = Object.keys(req.body);
  weekForm.splice(0, 1);
  weekForm.splice(0, 1);
  weekForm.splice(weekForm.length - 1, 1);

  for (var day in weekForm) {
    var data = weekForm[day].split('-');
    var d = data[0];
    var h = data[1];
    for (var i in week[d]) {
      if (week[d][i].hour == h) {
        week[d][i].color = "background: #00c853";
        break;
      }
    }
  }

  Calendar.update(idCal, {currWeek: week}, function(err, data) {
    if (err) {
      console.log('Error: ', err);
      res.send(500, err);
    }
    res.redirect('/users/' + req.session.user.id + '/' + req.params.rol + '/initTime');
  });
}

function getIndex(array, match) {
  for (var i in array) {
    if (array[i].name == match) return i;
  }
  return -1;
}

function isEmpty(week) {
  var keys = Object.keys(week);
  var empty = true;

  for (var key in keys) {
    if (week[keys[key]].length > 0) {
      empty = false;
      break;
    }
  }
  return empty;
}

function transform(week) {
  var k = Object.keys(week);
  var limit = week["lunes"].length;
  var newWeek = {};
  var hours = [];

  for (var i = 0; i < limit; i++) {
    var arr = [0];

    for (var d = 0, day = week[k[d]]; d < 6; d++) {
      arr.push(day[i]);
    }
    hours.push(week["lunes"][i].hour);
    newWeek[i] = arr;
  }

  return {newWeek: newWeek, hours: hours};
}
