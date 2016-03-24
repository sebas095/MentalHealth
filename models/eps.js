const resourceful = require('resourceful');

exports.Eps = resourceful.define('eps', function() {
  this.string('nit');
  this.string('epsName');
  this.string('email');
  this.string('epsPhone');
  this.string('address');
  this.json('rol');
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
