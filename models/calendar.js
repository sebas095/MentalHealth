const resourceful = require('resourceful');

 var Calendar = resourceful.define('calendar', function() {
  this.string('id');
  this.object('currWeek');
  this.object('currTime');
  this.array('record');

  this.timestamps(); //Time marks
});

module.exports = Calendar;
