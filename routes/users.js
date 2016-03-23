var express = require('express');
var router = express.Router();

module.exports = function(app, mountPoint) {
  // GET
  router.get('/new', function(req, res) {
    res.render('users/new');
  });

  router.get('/:id/:rol', function(req, res) {
    res.render('index');
  });

  router.get('/:id/:rol/calendar', function(req, res) {
    res.render('index');
  });

  router.get('/:id/:rol/allow', function(req, res) {
    res.render('index');
  });

  router.get('/:id/recovery', function(req, res) {
    res.render('index');
  });

  // POST
  router.post('/create', function(req, res) {
    res.render('index');
  });

  router.post('/:id/:rol/calendar', function(req, res) {
    res.render('index');
  });

  router.post('/:id/:rol/allow', function(req, res) {
    res.render('index');
  });


  router.post('/:id/recovery', function(req, res) {
    res.render('index');
  });

  // PUT
  router.put('/:id/:rol/edit', function(req, res) {
    res.render('index');
  });

  router.put('/:id/:rol/calendar', function(req, res) {
    res.render('index');
  });

  // DELETE
  router.delete('/:id', function(req, res) {
    res.render('index');
  });

  router.delete('/:id/:rol/calendar', function(req, res) {
    res.render('index');
  });

  app.use(mountPoint, router);
}
