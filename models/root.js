const resourceful = require('resourceful');

var Root = resourceful.define('root', function() {
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
  this.object('rol');
  this.string('password');
  this.number('accept');

  this.timestamps(); //Time marks
});

module.exports = Root;
