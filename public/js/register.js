$(function() {
  $('#users').click(function() {
    $('.userValidate').removeAttr('novalidate');
    $('#userForm').show();
    $('#epsForm').hide();
  });

  $('#eps').click(function() {
    $('.epsValidate').removeAttr('novalidate');
    $('#userForm').hide();
    $('#epsForm').show();
  });
});
