$(function() {
  $('#root').click(function() {
    $('.rootValidate').removeAttr('novalidate');
    $('#rootForm').show();
    $('#userForm').hide();
    $('#epsForm').hide();
  });

  $('#users').click(function() {
    $('.userValidate').removeAttr('novalidate');
    $('#rootForm').hide();
    $('#userForm').show();
    $('#epsForm').hide();
  });

  $('#eps').click(function() {
    $('.epsValidate').removeAttr('novalidate');
    $('#rootForm').hide();
    $('#userForm').hide();
    $('#epsForm').show();
  });
});
