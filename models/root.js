const resourceful = require('resourceful');

exports.Root = resourceful.define('root', function() {
  this.string('documentType');
  this.string('documentNumber');
  this.string('names');
  this.string('lastnames');
  this.string('gender');
  this.date('birthdate');
  this.string('email');
  this.string('phone');
  this.string('address');
  this.string('password');

  this.timestamps(); //Time marks
});
