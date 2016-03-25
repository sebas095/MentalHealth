const resourceful = require('resourceful');

 var Eps = resourceful.define('eps', function() {
  this.string('id');
  this.string('nit');
  this.string('epsName');
  this.string('email');
  this.string('epsPhone');
  this.string('address');
  this.object('rol');
  this.bool('accept');
  this.string('password');

  // Persona Encargada de la EPS
  this.string('documentType');
  this.string('documentNumber');
  this.string('names');
  this.string('lastnames');
  this.string('gender');
  this.string('phone');

  this.timestamps(); //Time marks
});

module.exports = Eps;
