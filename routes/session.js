var express = require('express');
var router = express.Router();

module.exports = function(app, mountPoint) {
  router.get('/login', function(req, res) {
    res.send("Login");
  });

  router.get('/logout', function(req, res) {
    res.send("Adios");
  });

  router.post('/login', function(req, res) {
    res.send("Datos enviados");
  });

  app.use(mountPoint, router);
}
