const resourceful = require('resourceful');

var User = resourceful.define('user', function() {
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
  this.array('roles');
  this.string('password');
  this.bool('accept');

  this.timestamps(); //Time marks
});

User.prototype.addRol = function(rol) {
  this.roles.push(rol);
};

module.exports = User;
