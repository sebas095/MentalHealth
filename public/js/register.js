$(function() {
  $('#users').click(function() {
    $('#userForm').show();
    $('#epsForm').hide();
    $('#submitForm').show();
  });

  $('#eps').click(function() {
    $('#userForm').hide();
    $('#epsForm').show();
    $('#submitForm').show();
  });
});
