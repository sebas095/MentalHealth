const User = require('../models/user');
const Calendar = require('../models/calendar');
const nodemailer = require('nodemailer');
const config = require('../config/email');
const Email = nodemailer.createTransport({service: "hotmail", auth: config.auth});
const uuid = require('uuid');
require('date-util');
var initCalendar = {
  lunes: [],
  martes: [],
  miercoles: [],
  jueves: [],
  viernes: [],
  sabado: []
};

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
        var exist = checkUser(req, data.currWeek);
        var choose = chooseDate(req, data.currWeek);
        var dateWeek = getDate();

        res.render('users/calendar/paciente', {
          calMedico: newWeek.newWeek,
          hourRow: newWeek.hours,
          medico: medico,
          length: data.currWeek['lunes'].length,
          empty: flag,
          exist: exist,
          choose: choose,
          dateWeek: dateWeek,
          rol: req.params.rol
        });
      });
    });
  }
  else {
    res.render('users/calendar/medicos', {medico: req.params.rol, times: req.query.times});
  }
}

exports.registerCited = function(req, res) {
  var medico = req.query.medico.split('-');
  var user = medico[0];
  var document = medico[1];
  var type = req.query.type;

  User.find({
    names: user,
    documentNumber: document
  }, function(err, data) {
    if (err) {
      console.log('Error: ', err);
      res.send(500, err);
    }

    var doct = data[0];
    var index = getIndex(data[0].rol, type);
    var idCal = data[0].rol[index].idCalendar;

    Calendar.get(idCal, function(err, data) {
      if (err) {
        console.log('Error: ', err);
        res.send(500, err);
      }
      res.render('users/calendar/new', {agenda: data, medico: doct});
    });
  });
}

exports.createCited = function(req, res) {
  var chooseDay = req.body.chooseDay.split('-');

  Calendar.get(req.body.dateCurr, function(err, data) {
    if (err) {
      console.log('Error: ', err);
      res.send(500, err);
    }

    var week = data.currWeek;
    week = update(req, week, chooseDay, true);

    Calendar.update(data.id, {currWeek: week}, function(err, data) {
      if (err) {
        console.log('Error: ', err);
        res.send(500, err);
      }
      res.redirect("/users/" + req.session.user.id + "/paciente/pendingList");
    });
  });
}

exports.loadForm = function(req, res) {
  var idMedico = req.query.medico;

  User.get(idMedico, function(err, data) {
    if (err) {
      console.log('Error: ', err);
      res.send(500, err);
    }

    var index1 = getIndex(data.rol,"medicoGeneral");
    var index2 = getIndex(data.rol, "medicoEspecialista");
    var doct = data;

    if(index1 != -1) {
      var idCal = data.rol[index1].idCalendar;
      Calendar.get(idCal, function(err, data) {
        if (err) {
          console.log('Error: ', err);
          res.send(500, err);
        }

        var day = chooseDate(req, data.currWeek);
        var chooseDay = day.key;
        var chooseHour = day.hour;

        res.render('users/calendar/editCite', {agenda: data, medico: doct, day: chooseDay, hour: chooseHour});
      });
    }
    else {
      var idCal = data.rol[index2].idCalendar;
      Calendar.get(idCal, function(err, data) {
        if (err) {
          console.log('Error: ', err);
          res.send(500, err);
        }

        var day = chooseDate(req, data.currWeek);
        var chooseDay = day.key;
        var chooseHour = day.hour;

        res.render('users/calendar/editCite', {agenda: data, medico: doct, day: chooseDay, hour: chooseHour});
      });
    }
  });
}

exports.editCited = function(req, res) {
  var chooseDay = req.body.chooseDay.split('-');
  var oldDate = req.body.oldDate.split('-');

  Calendar.get(req.body.dateCurr, function(err, data) {
    if (err) {
      console.log('Error: ', err);
      res.send(500, err);
    }

    var week = data.currWeek;
    week = update(req, week, oldDate, false);
    week = update(req, week, chooseDay, true);

    Calendar.update(data.id, {currWeek: week}, function(err, data) {
      if (err) {
        console.log('Error: ', err);
        res.send(500, err);
      }

      Email.sendMail({
        from: req.session.admin,
        to: req.session.user.email,
        subject: "Modificacón de cita en MENTALHEALTH",
        html: `<p>Estimado Usuario ${req.session.user.names},` +
              `</p><br><br>Se informa que su cita del dia ${oldDate[0]} a las ${oldDate[1]} en MentalHealth ha sido modificada exitosamente para` +
              ` el dia ${chooseDay[0]} a las ${chooseDay[1]} si desea ingresar para ver los cambios ingresa a la siguiente dirección: <a href="${req.session.url}login">Iniciar sesión</a>` +
              `<br><br><br><br> Att,<br><br> Equipo Administrativo de MENTALHEALTH`
      });

      res.redirect("/users/" + req.session.user.id + "/paciente/pendingList");
    });
  });
}

exports.resetCited = function(req, res) {
  var idMedico = req.body.medico;

  User.get(idMedico, function(err, data) {
    if (err) {
      console.log('Error: ', err);
      res.send(500, err);
    }

    var index1 = getIndex(data.rol,"medicoGeneral");
    var index2 = getIndex(data.rol, "medicoEspecialista");

    if (index1 != -1) {
      var idCal = data.rol[index1].idCalendar;
      Calendar.get(idCal, function(err, data) {
        if (err) {
          console.log('Error: ', err);
          res.send(500, err);
        }

        var dateCurr = chooseDate(req, data.currWeek);
        var oldDate = [dateCurr.key, dateCurr.hour];
        var week = data.currWeek;
        week = update(req, week, oldDate, false);

        Calendar.update(data.id, {currWeek: week}, function(err, data) {
          if (err) {
            console.log('Error: ', err);
            res.send(500, err);
          }

          Email.sendMail({
            from: req.session.admin,
            to: req.session.user.email,
            subject: "Eliminacón de cita en MENTALHEALTH",
            html: `<p>Estimado Usuario ${req.session.user.names},` +
                  `</p><br><br>Se informa que su cita del dia ${dateCurr.key} a las ${dateCurr.hour} en MentalHealth ha sido eliminada` +
                  ` si desea ingresar para ver los cambios ingresa a la siguiente dirección: <a href="${req.session.url}login">Iniciar sesión</a>` +
                  `<br><br><br><br> Att,<br><br> Equipo Administrativo de MENTALHEALTH`
          });

          res.redirect("/users/" + req.session.user.id + "/paciente/pendingList");
        });
      });
    }
    else {
      var idCal = data.rol[index2].idCalendar;
      Calendar.get(idCal, function(err, data) {
        if (err) {
          console.log('Error: ', err);
          res.send(500, err);
        }

        var dateCurr = chooseDate(req, data.currWeek);
        var oldDate = [dateCurr.key, dateCurr.hour];
        var week = data.currWeek;
        week = update(req, week, oldDate, false);

        Calendar.update(data.id, {currWeek: week}, function(err, data) {
          if (err) {
            console.log('Error: ', err);
            res.send(500, err);
          }

          res.redirect("/users/" + req.session.user.id + "/paciente/pendingList");
        });
      });
    }
  });
}

exports.edit = function(req, res) {
  var medico = req.session.user;
  var index = getIndex(medico.rol, req.params.rol);
  var idCal = medico.rol[index].idCalendar;

  Calendar.get(idCal, function(err, data) {
    if (err) {
      console.log('Error: ', err);
      res.send(500, err);
    }
    var newWeek = transform(data.currWeek);

    res.render('users/calendar/edit', {
      calMedico: newWeek.newWeek,
      hourRow: newWeek.hours,
      medico: medico,
      length: data.currWeek['lunes'].length,
      medicoRol: req.params.rol
    });
  });
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

    Calendar.all(function(err, data) {
      if (err) {
        console.log('Error: ', err);
        res.send(500, err);
      }

      var seen = false;
      for (var i in data) {
        if (checkUser(req, data[i].currWeek)) {
          seen = true;
          break;
        }
      }
      res.render('users/calendar/index', {generales: generales, especialistas: especialistas, seen: seen});
    });
  });
}

exports.reset = function(req, res) {
  var index = getIndex(req.session.user.rol, req.params.rol);
  var idCal = req.session.user.rol[index].idCalendar;

  Calendar.update(idCal, {currWeek: initCalendar}, function(err, data) {
    if (err) {
      console.log('Error: ', err);
      res.send(500, err);
    }

    Email.sendMail({
      from: req.session.admin,
      to: req.session.user.email,
      subject: "Eliminación de Agenda en MENTALHEALTH",
      html: `<p>Estimado Usuario ${req.session.user.names},` +
            `</p><br><br>Se informa que su agenda en MentalHealth ha sido elimininada` +
            ` si desea ingresar para ver los cambios ingresa a la siguiente dirección: <a href="${req.session.url}login">Iniciar sesión</a>` +
            `<br><br><br><br> Att,<br><br> Equipo Administrativo de MENTALHEALTH`
    });

    res.redirect('/users/' + req.session.user.id + '/' + req.params.rol + '/initTime');
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

exports.showCalendar = function(req, res) {
  var medico = req.session.user;
  var index = getIndex(medico.rol, req.params.rol);
  var idCal = medico.rol[index].idCalendar;

  Calendar.get(idCal, function(err, data) {
    if (err) {
      console.log('Error: ', err);
      res.send(500, err);
    }
    var newWeek = transform(data.currWeek);
    var flag = isEmpty(data.currWeek);
    var dateWeek = getDate();

    res.render('users/calendar/paciente', {
      calMedico: newWeek.newWeek,
      hourRow: newWeek.hours,
      medico: medico,
      length: data.currWeek['lunes'].length,
      empty: flag,
      choose: {},
      dateWeek: dateWeek,
      rol: req.params.rol
    });
  });
}

exports.saveChanges = function(req, res) {
  var index = getIndex(req.session.user.rol, req.params.rol);
  var idCal = req.session.user.rol[index].idCalendar;
  var week = manageCalendar(req);

  Calendar.update(idCal, {currWeek: week}, function(err, data) {
    if (err) {
      console.log('Error: ', err);
      res.send(500, err);
    }
    res.redirect('/users/' + req.session.user.id + '/' + req.params.rol + '/initTime');
  });
}

exports.editSave = function(req, res) {
  var index = getIndex(req.session.user.rol, req.params.rol);
  var idCal = req.session.user.rol[index].idCalendar;
  var week = manageCalendar(req);

  Calendar.update(idCal, {currWeek: week}, function(err, data) {
    if (err) {
      console.log('Error: ', err);
      res.send(500, err);
    }

    Email.sendMail({
      from: req.session.admin,
      to: req.session.user.email,
      subject: "Modificación de Agenda en MENTALHEALTH",
      html: `<p>Estimado Usuario ${req.session.user.names},` +
            `</p><br><br>Se informa que su agenda en MentalHealth ha sido modificada` +
            ` si desea ingresar para ver los cambios ingresa a la siguiente dirección: <a href="${req.session.url}login">Iniciar sesión</a>` +
            `<br><br><br><br> Att,<br><br> Equipo Administrativo de MENTALHEALTH`
    });

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
  var newWeek = {0: [0]};
  var hours = [];
  var json = {};

  for (var i = 0; i < limit; i++) {
    hours.push(week["lunes"][i].hour);
    json[week["lunes"][i].hour] = []
  }

  for (var d = 0; d < 6; d++) {
    for (var i in week[k[d]]) {
      json[week[k[d]][i].hour].push(week[k[d]][i]);
    }
  }

  var keys = Object.keys(json);
  for (var i in keys) {
    newWeek[i] = json[keys[i]];
  }

  return {newWeek: newWeek, hours: hours};
}


function manageCalendar(req) {
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
      json.color = "background: #e57373";
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
        week[d][i].color = "background: #a5d6a7";
        break;
      }
    }
  }
  return week;
}

function update(req, week, chooseDay, available) {
  var day = chooseDay[0];
  var hour = chooseDay[1];

  for (var i in week[day]) {
    if (week[day][i].hour == hour) {
      if (available) {
        week[day][i].color = "background: #e57373";
        week[day][i].idPatient = req.session.user.id;
      }
      else {
        week[day][i].color = "background: #a5d6a7";
        if (week[day][i].idPatient) delete week[day][i].idPatient;
      }
      break;
    }
  }

  return week;
}

function checkUser(req, week) {
  var keys = Object.keys(week);
  for (var i in keys) {
    for (var j in week[keys[i]]) {
      if (week[keys[i]][j].idPatient) {
        if (week[keys[i]][j].idPatient == req.session.user.id)
          return true;
      }
    }
  }
  return false;
}

function chooseDate(req, week) {
  var keys = Object.keys(week);
  for (var i in keys) {
    for (var j in week[keys[i]]) {
      if (week[keys[i]][j].idPatient) {
        if (week[keys[i]][j].idPatient == req.session.user.id)
          return {"id": req.session.user.id, "day": i, "key": keys[i], "hour": week[keys[i]][j].hour};
      }
    }
  }
  return {};
}

function getDate() {
  var keys = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];
  var now = new Date().strtotime('last monday').toString();
  var dateWeek = {};

  for (var i = 0; i < 6; i++) {
    var day = new Date(now).strtotime('+' + i +' day').toString().split(' ');
    day = day[1] + '/' + day[2] + '/' + day[3];
    dateWeek[keys[i]] = day;
  }
  return dateWeek;
}
