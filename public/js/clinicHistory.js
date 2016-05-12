$(function() {
	var histories = ($('#hist').val()).split(',');
	var patient = $('patientChoose').val();

	if (histories.indexOf(patient) != -1) {
		$('#viewOption').show();
	}
	else $('#viewOption').hide();
});