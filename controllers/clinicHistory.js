const User = require('../models/user');
const Calendar = require('../models/calendar');
const ClinicHistory = require('../models/clinicHistory');

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

    		var histories = ["test"];
    		ClinicHistory.all(function(err, data) {
    			if (err) {
    				console.log('Error: ', err);
     				return res.send(500, err);
    			}

    			for (var i in data) {
    				histories.push(data[i].idPatient);
    			}

  				res.render('users/clinicHistory/list', {patients: patients, rol: req.params.rol, histories: histories});
    		});
    	});
    });
	});
}

exports.new = function(req, res) {
	res.render('users/clinicHistory/new', {rol: req.params.rol});
}

exports.edit = function(req, res) {
	res.render('users/clinicHistory/edit', {rol: req.params.rol});
}

exports.show = function(req, res) {
	res.render('users/clinicHistory/show', {rol: req.params.rol});
}

exports.create = function(req, res) {
	
}

exports.modify = function(req, res) {
	
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