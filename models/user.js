const resourceful = require('resourceful');

exports.User = resourceful.define('user', function() {
  this.string('documentType');
  this.string('documentNumber');
  this.string('names');
  this.string('lastnames');
  this.string('gender');
  this.date('birthdate');
  this.string('email');
  this.string('phone');
  this.string('address');
  this.string('epsRelated');
  this.array('roles');
  this.string('password');
  
  this.timestamps(); //Time marks
});
