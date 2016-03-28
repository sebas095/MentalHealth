const resourceful = require('resourceful');

var User = resourceful.define('user', function() {
  this.string('id');
  this.string('documentType');
  this.string('documentNumber');
  this.string('names');
  this.string('lastnames');
  this.string('gender');
  this.string('birthdate');
  this.string('email');
  this.string('phone');
  this.string('address');
  this.string('epsRelated');
  this.array('rol');
  this.string('password');
  this.number('accept');

  this.timestamps(); //Time marks
});

module.exports = User;
