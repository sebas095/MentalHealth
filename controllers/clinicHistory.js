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

    		var histories = [];
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
  var history = {};
  history.names = req.body.names || "";
  history.lastnames = req.body.lastnames || "";
  history.age = req.body.age || "";
  history.gender = req.body.gender || "";
  history.job = req.body.job || "";
  history.birthdate = req.body.birthdate || "";
  history.civilStatus = req.body.state || "";
  history.documentNumber = req.body.document || "";
  history.nacionality = req.body.nacion || "";
  history.currAddres = req.body.currAddres || "";
  history.pastAddress = req.body.pastAddress || "";
  history.educationLevel = req.body.grade || "";
  history.religion = req.body.religion || "";
  history.reasonConsultation = req.body.reasonsCons || "";
  history.diseaseHistory = req.body.history || "";
  history.parentsNames = req.body.parentsNames || "";
  history.parentsAlive = req.body.parentsAlive || "";
  history.parentsDead = req.body.parentsDead || "";
  history.parentsReasons = req.body.parentsReasons || "";
  history.sibNames = req.body.sibNames || "";
  history.sibAlive = req.body.sibAlive || "";
  history.sibDead = req.body.sibDead || "";
  history.sibReasons = req.body.sibReasons || "";
  history.sonsNames = req.body.sonNames || "";
  history.sonsAlive = req.body.sonAlive || "";
  history.sonsDead = req.body.sonDead || "";
  history.sonsReasons = req.body.sonReasons || "";
  history.DBTParents = req.body.DBTParents || "";
  history.DBTParentsR = req.body.DBTParentsR || "";
  history.HTAParents = req.body.HTAParents || "";
  history.HTAParentsR = req.body.HTAParentsR || "";
  history.TBCParents = req.body.TBCParentsC || "";
  history.TBCParentsR = req.body.TBCParentsR || "";
  history.gemelarParents = req.body.gemelarParents || "";
  history.gemelarParentsR = req.body.gemelarParentsR || "";
  history.otherParents = req.body.otherParents || "";
  history.otherParentsR = req.body.otherParentsR || "";
  history.alcohol = req.body.alcohol || "";
  history.snuff = req.body.snuff || "";
  history.drugs = req.body.drugs || "";
  history.infusions = req.body.infusions || "";
  history.feeding = req.body.feeding || "";
  history.dipsia = req.body.dipsia || "";
  history.diuresia = req.body.diuresia || "";
  history.catarsis = req.body.catarsis || "";
  history.somnia = req.body.somnia || "";
  history.othersFis = req.body.othersFis || "";
  history.infancy = req.body.infancy || "";
  history.adult = req.body.adult || "";
  history.DBT = req.body.DBT || "";
  history.DBTReasons = req.body.DBTReasons || "";
  history.HTA = req.body.HTA || "";
  history.HTAReasons = req.body.HTAReasons || "";
  history.TBC = req.body.TBC || "";
  history.TBCReasons = req.body.TBCReasons || "";
  history.gemelar = req.body.gemelar || "";
  history.gemelarReasons = req.body.gemelarReasons || "";
  history.othersTr = req.body.othersTr || "";
  history.othersTrReasons = req.body.othersTrReasons || "";
  history.quir = req.body.quir || "";
  history.trauma = req.body.trauma || "";
  history.allergy = req.body.allergy || "";
  history.otherPat = req.body.otherPat || "";

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