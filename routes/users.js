var express = require('express');
var router = express.Router();

module.exports = function(app, mountPoint) {
  // GET
  router.get('/new', function(req, res) {
    res.render('users/new');
  });

  router.get('/:id/:rol(\\eps|paciente|root|medico(General|Especialista))', function(req, res) {
    res.render('index');
  });

  router.get('/:id/edit', function(req, res) {
    res.render('users/edit');
  });

  router.get('/:id/:rol(\\eps|paciente|root|medico(General|Especialista))/edit', function(req, res) {
    res.render('users/editRol');
  });

  router.get('/:id/:rol(\\paciente|medico(General|Especialista))/calendar', function(req, res) {
    res.render('index');
  });

  router.get('/:id/:rol(\\eps|root)/pending', function(req, res) {
    res.render('admin/pending');
  });

  router.get('/:id/:rol(\\eps|root)/allow', function(req, res) {
    var rol = req.params.rol;
    if (rol == 'eps')  res.render('admin/allowEps');
    if (rol == 'root') res.render('admin/allowUsers');
  });

  router.get('/:id/recovery', function(req, res) {
    res.render('index');
  });

  // POST
  router.post('/create', function(req, res) {
    res.render('index');
  });

  router.post('/:id/:rol(\\paciente|medico(General|Especialista))/calendar', function(req, res) {
    res.render('index');
  });

  router.post('/:id/:rol(\\eps|root)/allow', function(req, res) {
    res.render('index');
  });


  router.post('/:id/recovery', function(req, res) {
    res.render('index');
  });

  // PUT
  router.put('/:id/edit', function(req, res) {
    //res.render();
  });

  router.put('/:id/:rol(\\eps|paciente|root|medico(General|Especialista))/edit', function(req, res) {
    //res.render();
  });

  router.put('/:id/:rol(\\paciente|medico(General|Especialista))/calendar', function(req, res) {
    res.render('index');
  });

  // DELETE
  router.delete('/:id', function(req, res) {
    res.render('index');
  });

  router.delete('/:id/:rol(\\paciente|medico(General|Especialista))/calendar', function(req, res) {
    res.render('index');
  });

  app.use(mountPoint, router);
}
