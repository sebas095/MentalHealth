const express = require('express');
var router = express.Router();

const userController = require('../controllers/users');
const rootController = require('../controllers/root');
const epsController = require('../controllers/eps');
const sessionController = require('../controllers/session');

module.exports = function(app, mountPoint) {
  // GET
  router.get('/new', function(req, res) {
    res.render('users/new');
  });

  router.get('/:id', sessionController.loginRequired, function(req, res) {
    res.render('index');
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

  router.get('/:id/:rol(\\eps|root)/pending', sessionController.loginRequired, userController.pending);

  router.get('/:id/:rol(\\eps|root)/allow', sessionController.loginRequired, userController.allow);

  router.get('/:id/recovery', function(req, res) {
    res.render('users/recovery');
  });

  // POST
  router.post('/create/root', rootController.create);

  router.post('/create/eps', epsController.create);

  router.post('/create/user', userController.create);

  router.post('/:id/:rol(\\eps|root)/pending', sessionController.loginRequired, userController.allowUser);

  router.post('/:id/:rol(\\paciente|medico(General|Especialista))/calendar', function(req, res) {
    res.render('index');
  });

  router.post('/:id/:rol(\\eps)/allow', sessionController.loginRequired, epsController.allowUsers);

  router.post('/:id/:rol(\\root)/allow', sessionController.loginRequired, rootController.allowEps);

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
