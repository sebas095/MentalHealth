const resourceful = require('resourceful');

var ClinicHistory = resourceful.define('clinicHistory', function() {
  this.string('id');
  this.string('idPatient');
  this.array('registers');

  this.timestamps();
});

module.exports = ClinicHistory;
