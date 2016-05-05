const express = require('express');
var router = express.Router();

const userController = require('../controllers/users');
const rootController = require('../controllers/root');
const epsController = require('../controllers/eps');
const sessionController = require('../controllers/session');
const calendarController = require('../controllers/calendar');

module.exports = function(app, mountPoint) {
  // GET
  router.get('/new', userController.new);
  router.get('/:id/:rol(\\eps|paciente|root|medico(General|Especialista))', sessionController.loginRequired, userController.home);
  router.get('/:id/edit', sessionController.loginRequired, userController.edit);
  router.get('/:id/:rol(\\eps|paciente|root|medico(General|Especialista))/edit', sessionController.loginRequired, userController.rolForm);
  router.get('/:id/paciente/pendingList', sessionController.loginRequired, calendarController.pending);
  router.get('/:id/:rol(\\medico(General|Especialista))/initTime', sessionController.loginRequired, calendarController.initTime);
  router.get('/:id/:rol(\\paciente|medico(General|Especialista))/calendar', sessionController.loginRequired, calendarController.home);
  router.get('/:id/:rol(\\medico(General|Especialista))/calendar/edit', sessionController.loginRequired, calendarController.edit);
  router.get('/:id/:rol(\\medico(General|Especialista))/calendar/show', sessionController.loginRequired, calendarController.showCalendar);
  router.get('/:id/:rol(\\eps|root)/pending', sessionController.loginRequired, userController.pending);
  router.get('/:id/root/manage', sessionController.loginRequired, rootController.manage);
  router.get('/:id/eps/manage', sessionController.loginRequired, epsController.manage);
  router.get('/:id/eps/manage/editRol', sessionController.loginRequired, epsController.chooseRol);
  router.get('/:id/root/manage/edit', sessionController.loginRequired, rootController.manageProfile);
  router.get('/:id/eps/manage/edit', sessionController.loginRequired, epsController.manageProfile);
  router.get('/:id/:rol(\\eps|root)/allow', sessionController.loginRequired, userController.allow);
  router.get('/:id/data', sessionController.loginRequired, userController.dataRol);

  // POST
  router.post('/create/root', rootController.create);
  router.post('/create/eps', epsController.create);
  router.post('/create/user', userController.create);
  router.post('/:id/:rol(\\eps|root)/pending', sessionController.loginRequired, userController.allowUser);

  // PUT
  router.put('/:id/edit', sessionController.loginRequired, userController.saveChanges);
  router.put('/:id/:rol(\\eps|paciente|root|medico(General|Especialista))/edit', sessionController.loginRequired, userController.editRol);
  router.put('/:id/eps/allow', sessionController.loginRequired, epsController.allowUsers);
  router.put('/:id/root/allow', sessionController.loginRequired, rootController.allowEps);
  router.put('/:id/:rol(\\medico(General|Especialista))/calendar', sessionController.loginRequired, calendarController.saveChanges);
  router.put('/:id/root/manage/edit', sessionController.loginRequired, rootController.storeChanges);
  router.put('/:id/eps/manage/edit', sessionController.loginRequired, epsController.storeChanges);
  router.put('/:id/root/manage/editRol', sessionController.loginRequired, rootController.editRolProfile);
  router.put('/:id/eps/manage/editRol', sessionController.loginRequired, epsController.editRolProfile);
  router.put('/:id/:rol(\\medico(General|Especialista))/calendar/edit', sessionController.loginRequired, calendarController.editSave);
  router.put('/:id/:rol(\\paciente)/calendar/calendar', sessionController.loginRequired, calendarController.createCited);
  router.put('/:id/:rol(\\paciente)/calendar/edit', sessionController.loginRequired, calendarController.editCited);

  // DELETE
  router.delete('/:id/edit', sessionController.loginRequired, userController.deleteAccount);
  router.delete('/:id/:rol(\\eps|paciente|root|medico(General|Especialista))/edit', sessionController.loginRequired, userController.deleteRolImage);
  router.delete('/:id/root/manage/editRol', sessionController.loginRequired, rootController.deleteImageProfile);
  router.delete('/:id/eps/manage/editRol', sessionController.loginRequired, epsController.deleteImageProfile);
  router.delete('/:id/:rol(\\medico(General|Especialista))/calendar', sessionController.loginRequired, calendarController.reset);
  router.delete('/:id/:rol(\\paciente)/calendar', sessionController.loginRequired, calendarController.resetCited);

  app.use(mountPoint, router);
}
