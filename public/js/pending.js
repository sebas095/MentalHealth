$(function() {
  var path = (window.location.pathname).split('/');
  var ok = (path[3] == 'eps' || path[3] == 'root' || path[3] == 'medicoGeneral' || path[3] == 'medicoEspecialista');

  if (path.length == 4 && path[1] == 'users' && ok) {
    $('#pending').show();
  }
  else {
    $('#pending').hide();
  }
});
