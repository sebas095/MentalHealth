const express = require('express');
var router = express.Router();

const userController = require('../controllers/users');
const rootController = require('../controllers/root');
const epsController = require('../controllers/eps');
const sessionController = require('../controllers/session');

module.exports = function(app, mountPoint) {
  // GET
  router.get('/new', userController.new);

  router.get('/:id/:rol(\\eps|paciente|root|medico(General|Especialista))', sessionController.loginRequired, userController.home);

  router.get('/:id/edit', sessionController.loginRequired, userController.edit);

  router.get('/:id/:rol(\\eps|paciente|root|medico(General|Especialista))/edit', sessionController.loginRequired, userController.rolForm);

  router.get('/:id/:rol(\\paciente|medico(General|Especialista))/calendar', function(req, res) {
    res.render('index');
  });

  router.get('/:id/:rol(\\eps|root)/pending', sessionController.loginRequired, userController.pending);

  router.get('/:id/:rol(\\eps|root)/allow', sessionController.loginRequired, userController.allow);

  router.get('/:id/data', sessionController.loginRequired, userController.dataRol);

  // POST
  router.post('/create/root', rootController.create);

  router.post('/create/eps', epsController.create);

  router.post('/create/user', userController.create);

  router.post('/:id/:rol(\\eps|root)/pending', sessionController.loginRequired, userController.allowUser);

  router.post('/:id/:rol(\\paciente|medico(General|Especialista))/calendar', function(req, res) {
    res.render('index');
  });

  // PUT
  router.put('/:id/edit', sessionController.loginRequired, userController.saveChanges);

  router.put('/:id/:rol(\\eps|paciente|root|medico(General|Especialista))/edit', sessionController.loginRequired, userController.editRol);

  router.put('/:id/eps/allow', sessionController.loginRequired, epsController.allowUsers);

  router.put('/:id/root/allow', sessionController.loginRequired, rootController.allowEps);

  router.put('/:id/:rol(\\paciente|medico(General|Especialista))/calendar', function(req, res) {
    res.render('index');
  });

  // DELETE
  router.delete('/:id/edit', sessionController.loginRequired, userController.deleteAccount);

  router.delete('/:id/:rol(\\eps|paciente|root|medico(General|Especialista))/edit', sessionController.loginRequired, userController.deleteRolImage);

  router.delete('/:id/:rol(\\paciente|medico(General|Especialista))/calendar', function(req, res) {
    res.render('index');
  });

  app.use(mountPoint, router);
}
