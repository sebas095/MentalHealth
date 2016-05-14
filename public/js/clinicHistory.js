$(function() {
	var histories = ($('#hist').val());
	histories = (histories)? histories.split(',') : [];
	var patient = $('#patientChoose').val();

	if (histories.indexOf(patient) != -1) {
		$('#viewOption').show();
		$('#hist').val(histories[histories.indexOf(patient)]);
	}
	else $('#viewOption').hide();
});