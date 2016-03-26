const express = require('express');
var router = express.Router();

const sessionController = require('../controllers/session');

module.exports = function(app, mountPoint) {
  router.get('/login', sessionController.new);
  router.get('/logout', sessionController.destroy);
  router.post('/login', sessionController.create);

  app.use(mountPoint, router);
}
