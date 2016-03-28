const express = require('express');
var router = express.Router();

const sessionController = require('../controllers/session');

module.exports = function(app, mountPoint) {
  router.get('/recovery', sessionController.newPassword);

  app.use(mountPoint, router);
}
