var express = require('express');
var router = express.Router();

module.exports = function(app, mountPoint) {
  router.get('/', function(req, res) {
    res.send("Login");
  });

  router.post('/', function(req, res) {
    res.send("Datos enviados");
  });

  app.use(mountPoint, router);
}
