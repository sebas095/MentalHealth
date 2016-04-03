const User = require('../models/user');
const Eps = require('../models/eps');
const Root = require('../models/root');
const uuid = require('uuid');
const multer = require('multer');
const path = require('path');
const imageHelper = require('../helpers/images');
var upload = multer({dest: 'data/'}).single('photo');

exports.create = function(req, res) {
  var roles = [];
  if (req.body.paciente) {
    roles.push({
      name: req.body.paciente,
      photo: null,
      ext: null
    });
  }
  if (req.body.medicoGeneral) {
    roles.push({
      name: req.body.medicoGeneral,
      photo: null,
      ext: null
    });
  }
  if (req.body.medicoEspecialista) {
    roles.push({
      name: req.body.medicoEspecialista,
      photo: null,
      ext: null
    });
  }

  User.create({
    id: uuid.v4(),
    documentType: req.body.typeDocument,
    documentNumber: req.body.numDocument,
    names: req.body.names,
    lastnames: req.body.lastnames,
    gender: req.body.gender,
    birthdate: req.body.birthdate,
    email: req.body.mail,
    phone: req.body.phone,
    address: req.body.address,
    epsRelated: req.body.epsRelated,
    rol: roles,
    password: req.body.pwd,
    accept: 0
  }, function(err, data) {
    if (err) {
      console.log('Error: ', err);
      return res.send(500, err);
    }
    res.redirect('/');
  });
}

exports.home = function(req, res) {
  var tmpExt = undefined;
  if (Array.isArray(req.session.user.rol)) {
    var index = getIndex(req.session.user.rol, req.params.rol);
    tmpExt = req.session.user.rol[index].ext;
    res.render('index', {tmpExt: tmpExt});
  }
  else {
    tmpExt = req.session.user.rol.ext;
    res.render('index', {tmpExt: tmpExt});
  }
}

exports.rolForm = function(req, res) {
  res.render('users/editRol', {rolCurr: req.params.rol});
}

exports.deleteRolImage = function(req, res) {
  var rol = req.params.rol;

  if (Array.isArray(req.session.user.rol)) {
    var index = getIndex(req.session.user.rol, rol);

    imageHelper.deleteImage({path: req.session.user.rol[index].photo}, function() {
      var curr = req.session.user.id + '-' + req.params.rol + req.session.user.rol[index].ext;
      var dir = path.join(path.resolve(__dirname, '..', 'public/images/tmp'), curr);

      imageHelper.deleteImage({path: dir}, function() {
        req.session.user.rol[index].photo = null;
        req.session.user.rol[index].ext = null;

        User.update(req.session.user.id, {rol: req.session.user.rol}, function(err, data) {
          if (err) {
            console.log('Error: ', err);
            return res.send(500, err);
          }
          res.redirect('/users/' + req.session.user.id + '/' + rol);
        });
      });
    });
  }

  else {
    if (rol == 'eps') {
      imageHelper.deleteImage({path: req.session.user.rol.photo}, function() {
        var curr = req.session.user.id + '-' + req.params.rol + req.session.user.rol.ext;
        var dir = path.join(path.resolve(__dirname, '..', 'public/images/tmp'), curr);

        imageHelper.deleteImage({path: dir}, function() {
          req.session.user.rol.photo = null;
          req.session.user.rol.ext = null;

          Eps.update(req.session.user.id, {rol: req.session.user.rol}, function(err, data) {
            if (err) {
              console.log('Error: ', err);
              return res.send(500, err);
            }
            res.redirect('/users/' + req.session.user.id + '/' + rol);
          });
        });
      });
    }

    else {
      imageHelper.deleteImage({path: req.session.user.rol.photo}, function() {
        var curr = req.session.user.id + '-' + req.params.rol + req.session.user.rol.ext;
        var dir = path.join(path.resolve(__dirname, '..', 'public/images/tmp'), curr);

        imageHelper.deleteImage({path: dir}, function() {
          req.session.user.rol.photo = null;
          req.session.user.rol.ext = null;

          Root.update(req.session.user.id, {rol: req.session.user.rol}, function(err, data) {
            if (err) {
              console.log('Error: ', err);
              return res.send(500, err);
            }
            res.redirect('/users/' + req.session.user.id + '/' + req.params.rol);
          });
        });
      });
    }
  }
}

exports.dataRol = function(req, res) {
  var edit = {};
  edit.rol = req.query.roles;
  var index = getIndex(req.session.user.rol, edit.rol);
  edit.ext = req.session.user.rol[index].ext;

  if (req.query.edit) edit.state = 'edit';
  if (req.query.changes) edit.state = 'change';

  req.session.rolEdit = edit;
  if (edit.state == 'edit') {
    res.redirect('/users/' + req.session.user.id + '/' + edit.rol + '/edit');
  }
  if (edit.state == 'change') {
    res.redirect('/users/' + req.session.user.id + '/' + edit.rol);
  }
}

exports.editRol = function(req, res) {
  upload(req, res, function(err) {
    if (err) console.log('Error: ', err);
    if (req.file) {
      var ext = path.extname(req.file.originalname);

      if (ext === '.jpg' || ext === '.png' || ext === '.gif' || ext === '.bmp') {
        if (req.params.rol == 'eps') {
          if (req.session.user.rol.photo === null) {
            req.session.user.rol.photo = req.file.path;
            req.session.user.rol.ext = ext;

            Eps.update(req.params.id, {rol: req.session.user.rol}, function(err, data) {
              if (err) {
                console.log('Error: ', err);
                return res.send(500, err);
              }

              imageHelper.translateImage({
                path: req.file.path,
                targetName: req.params.id + '-' + req.params.rol + ext,
                targetPath: path.resolve(__dirname, '..', 'public/images/tmp')
              }, function() {
                res.redirect('/users/' + req.params.id + '/' + req.params.rol);
              });
            });
          }
          else {
            imageHelper.deleteImage({path: req.session.user.rol.photo}, function() {
              req.session.user.rol.photo = req.file.path;
              var tmpExt = req.session.user.rol.ext;
              req.session.user.rol.ext = ext;

              Eps.update(req.params.id, {rol: req.session.user.rol}, function(err, data) {
                if (err) {
                  console.log('Error: ', err);
                  return res.send(500, err);
                }

                imageHelper.deleteImage({
                  path: path.join(path.resolve(__dirname, '..', 'public/images/tmp'), req.params.id + '-' + req.params.rol + tmpExt)
                }, function() {
                  imageHelper.translateImage({
                    path: req.file.path,
                    targetName: req.params.id + '-' + req.params.rol + ext,
                    targetPath: path.resolve(__dirname, '..', 'public/images/tmp')
                  }, function() {
                    res.redirect('/users/' + req.params.id + '/' + req.params.rol);
                  });
                });
              });
            });
          }
        }

        if (req.params.rol == 'root') {
          if (req.session.user.rol.photo == null) {
            req.session.user.rol.photo = req.file.path;
            req.session.user.rol.ext = ext;

            Root.update(req.params.id, {rol: req.session.user.rol}, function(err, data) {
              if (err) {
                console.log('Error: ', err);
                return res.send(500, err);
              }

              imageHelper.translateImage({
                path: req.file.path,
                targetName: req.params.id + '-' + req.params.rol + ext,
                targetPath: path.resolve(__dirname, '..', 'public/images/tmp')
              }, function() {
                res.redirect('/users/' + req.params.id + '/' + req.params.rol);
              });
            });
          }
          else if (req.session.user.rol.photo != null) {
            imageHelper.deleteImage({path: req.session.user.rol.photo}, function() {
              req.session.user.rol.photo = req.file.path;
              var tmpExt = req.session.user.rol.ext;
              req.session.user.rol.ext = ext;

              Root.update(req.params.id, {rol: req.session.user.rol}, function(err, data) {
                if (err) {
                  console.log('Error: ', err);
                  return res.send(500, err);
                }

                imageHelper.deleteImage({
                  path: path.join(path.resolve(__dirname, '..', 'public/images/tmp'), req.params.id + '-' + req.params.rol + tmpExt)
                }, function() {
                  imageHelper.translateImage({
                    path: req.file.path,
                    targetName: req.params.id + '-' + req.params.rol + ext,
                    targetPath: path.resolve(__dirname, '..', 'public/images/tmp')
                  }, function() {
                    res.redirect('/users/' + req.params.id + '/' + req.params.rol);
                  });
                });
              });
            });
          }
        }

        else if (Array.isArray(req.session.user.rol)) {
          var index = getIndex(req.session.user.rol, req.params.rol);

          if (req.session.user.rol[index].photo === null) {
            req.session.user.rol[index].photo = req.file.path;
            req.session.user.rol[index].ext = ext;

            User.update(req.params.id, {rol: req.session.user.rol}, function(err, data) {
              if (err) {
                console.log('Error: ', err);
                return res.send(500, err);
              }

              imageHelper.translateImage({
                path: req.file.path,
                targetName: req.params.id + '-' + req.params.rol + ext,
                targetPath: path.resolve(__dirname, '..', 'public/images/tmp')
              }, function() {
                res.redirect('/users/' + req.params.id + '/' + req.params.rol);
              });
            });
          }
          else {
            imageHelper.deleteImage({path: req.session.user.rol[index].photo}, function() {
              req.session.user.rol[index].photo = req.file.path;
              var tmpExt = req.session.user.rol[index].ext;
              req.session.user.rol[index].ext = ext;

              User.update(req.params.id, {rol: req.session.user.rol}, function(err, data) {
                if (err) {
                  console.log('Error: ', err);
                  return res.send(500, err);
                }

                imageHelper.deleteImage({
                  path: path.join(path.resolve(__dirname, '..', 'public/images/tmp'), req.params.id + '-' + req.params.rol + tmpExt)
                }, function() {
                  imageHelper.translateImage({
                    path: req.file.path,
                    targetName: req.params.id + '-' + req.params.rol + ext,
                    targetPath: path.resolve(__dirname, '..', 'public/images/tmp')
                  }, function() {
                    res.redirect('/users/' + req.params.id + '/' + req.params.rol);
                  });
                });
              });
            });
          }
        }
      }

      else {
        imageHelper.deleteImage({path: req.file.path}, function() {
            res.redirect('/users/' + req.params.id + '/' + req.params.rol);
          }
        );
      }
    }
    else res.redirect('/users/' + req.params.id + '/' + req.params.rol);
  });
}

function getIndex(array, match) {
  for (var i in array) {
    if (array[i].name == match) return i;
  }
  return -1;
}

exports.pending = function(req, res) {
  if (req.params.rol == 'root') {
    Eps.find({accept: 0}, function(err, data) {
      if (err) {
        console.log('Error: ', err);
        return res.send(500, err);
      }
      if (data.length == 0) {
        res.render('admin/pending', {allUsers: []});
      }
      else {
        res.render('admin/pending',{allUsers: data});
      }
    });
  }
  else {
    User.find({accept: 0}, function(err, data) {
      if (err) {
        console.log('Error: ', err);
        return res.send(500, err);
      }
      if (data.length == 0) {
        res.render('admin/pending', {allUsers: []});
      }
      else {
        res.render('admin/pending',{allUsers: data});
      }
    });
  }
}

exports.new = function(req, res) {
  Root.find({accept: 1}, function(err, data) {
    if (err) {
      console.log('Error: ', err);
      return res.send(500, err);
    }
    if (data.length == 0) {
      res.render('users/new', {hasRoot: false});
    }
    else res.render('users/new', {hasRoot: true});
  });
}

exports.edit = function(req, res) {
  res.render('users/edit');
}

exports.saveChanges = function(req, res) {
  var user = {};
  if (!Array.isArray(req.session.user.rol)) {
    if (req.session.user.rol.name == 'eps') {
      if (req.body.nit)          user.documentNumber = req.body.nit;
      if (req.body.nameEps)      user.names = req.body.nameEps;
      if (req.body.mailEps)      user.email = req.body.mailEps;
      if (req.body.phoneEps)     user.epsPhone = req.body.phoneEps;
      if (req.body.addressEps)   user.address = req.body.addressEps;
      if (req.body.typeDocument) user.documentType = req.body.typeDocument;
      if (req.body.numDocument)  user.documentNumberPerson = req.body.numDocument;
      if (req.body.names)        user.namesPerson = req.body.names;
      if (req.body.lastnames)    user.lastnames = req.body.lastnames;
      if (req.body.gender)       user.gender = req.body.gender;
      if (req.body.phone)        user.phone = req.body.phone;
      if (req.body.pwd)          user.password = req.body.pwd;

      Eps.update(req.session.user.id, user, function(err, data) {
        if (err) {
          console.log('Error: ', err);
          return res.send(500, err);
        }
        req.session.user = data;
        res.redirect('/users/' + req.session.user.id + '/eps');
      });
    }
    else {
      if (req.body.typeDocument) user.documentType = req.body.typeDocument;
      if (req.body.numDocument)  user.documentNumber = req.body.numDocument;
      if (req.body.names)        user.names = req.body.names;
      if (req.body.lastnames)    user.lastnames = req.body.lastnames;
      if (req.body.gender)       user.gender = req.body.gender;
      if (req.body.birthdate)    user.birthdate = req.body.birthdate;
      if (req.body.mail)         user.email = req.body.mail;
      if (req.body.phone)        user.phone = req.body.phone;
      if (req.body.address)      user.address = req.body.address;
      if (req.body.pwd)          user.password = req.body.pwd;

      Root.update(req.session.user.id, user, function(err, data) {
        if (err) {
          console.log('Error: ', err);
          return res.send(500, err);
        }
        req.session.user = data;
        res.redirect('/users/' + req.session.user.id + '/root');
      });
    }
  }
  else {
    if (req.body.typeDocument) user.documentType = req.body.typeDocument;
    if (req.body.numDocument)  user.documentNumber = req.body.numDocument;
    if (req.body.names)        user.names = req.body.names;
    if (req.body.lastnames)    user.lastnames = req.body.lastnames;
    if (req.body.gender)       user.gender = req.body.gender;
    if (req.body.birthdate)    user.birthdate = req.body.birthdate;
    if (req.body.mail)         user.email = req.body.mail;
    if (req.body.phone)        user.phone = req.body.phone;
    if (req.body.address)      user.address = req.body.address;
    if (req.body.epsRelated)   user.epsRelated = req.body.epsRelated;
    if (req.body.pwd)          user.password = req.body.pwd;

    User.update(req.session.user.id, user, function(err, data) {
      if (err) {
        console.log('Error: ', err);
        return res.send(500, err);
      }
      var rol = req.session.rolEdit.rol || req.session.user.rol[0].name;
      req.session.user = data;
      res.redirect('/users/' + req.session.user.id + '/' + rol);
    });
  }
}

exports.deleteAccount = function(req, res) {
  if (!Array.isArray(req.session.user.rol)) {
    if (req.session.user.rol.name == 'eps') {
      Eps.update(req.session.user.id, {accept: 2}, function(err, data) {
        if (err) {
          console.log('Error: ', err);
          return res.send(500, err);
        }
        delete req.session.user;
        res.redirect('/');
      });
      res.redirect('/');
    }
  }
  else {
    User.update(req.session.user.id, {accept: 2}, function(err, data) {
      if (err) {
        console.log('Error: ', err);
        return res.send(500, err);
      }
      delete req.session.user;
      res.redirect('/');
    });
  }
}

exports.allowUser = function(req, res) {
  req.session.pendingUser = req.body;
  res.redirect('/users/' + req.session.user.id + '/' + req.session.user.rol.name + '/allow');
}

exports.allow = function(req, res) {
  var rol = req.params.rol;
  var user = req.session.pendingUser.requests.split('-');

  if (rol == 'eps') {
    User.find({
      names: user[0],
      documentNumber: user[1]
    }, function(err, data) {
      if (err) {
        console.log('Error: ', err);
        return res.send(500, err);
      }
      else {
        res.render('admin/allowUsers', {allowUser: data[0]});
      }
    });
  }

  else {
    Eps.find({
      names: user[0],
      documentNumber: user[1]
    }, function(err, data) {
      if (err) {
        console.log('Error: ', err);
        return res.send(500, err);
      }
      else {
        res.render('admin/allowEps', {allowUser: data[0]});
      }
    });
  }
}
