$(function() {
  $('#cGeneral').click(function() {
    $('#calendarGeneral').show();
    $('#calendarEspecialista').hide();
  });

  $('#cEspecialista').click(function() {
    $('#calendarEspecialista').show();
    $('#calendarGeneral').hide();
  });
});
