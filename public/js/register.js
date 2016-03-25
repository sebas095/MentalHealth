$(function() {
  $('#users').click(function() {
    $('#userForm').show();
    $('#epsForm').hide();
  });

  $('#eps').click(function() {
    $('#userForm').hide();
    $('#epsForm').show();
  });
});
