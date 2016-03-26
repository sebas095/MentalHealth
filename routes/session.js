const express = require('express');
var router = express.Router();

const sessionController = require('../controllers/session');

module.exports = function(app, mountPoint) {
  router.get('/login', sessionController.new);
  router.post('/login', sessionController.create);
  router.delete('/logout', sessionController.destroy);

  app.use(mountPoint, router);
}
