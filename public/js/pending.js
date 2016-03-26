$(function() {
  var path = (window.location.pathname).split('/');
  if (path.length == 3 && path[1] == 'users') {
    $('#pending').show();
  }
  else {
    $('#pending').hide();
  }
});
