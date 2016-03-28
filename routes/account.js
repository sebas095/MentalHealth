const express = require('express');
var router = express.Router();

const sessionController = require('../controllers/session');

module.exports = function(app, mountPoint) {
  router.get('/recovery', sessionController.newPassword);
  router.get('/', sessionController.request);
  router.get('/newPassword', sessionController.recovery);
  router.put('/newPassword', sessionController.changePassword);

  app.use(mountPoint, router);
}
