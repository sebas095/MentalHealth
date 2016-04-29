const resourceful = require('resourceful');

var ClinicHistory = resourceful.define('clinicHistory', function() {
  this.string('id');
  this.string('job');
  this.number('historyNumber');
  this.string('civilStatus');
  this.string('currAddress');
  this.string('pastAddress');
  this.string('educationLevel');
  this.string('religion');
  this.string('reasonConsultation');
  this.string('diseaseHistory');

  // Antecedentes Heredo Familiares
  this.string('parentsAlive')
  this.object('prentsDead');
  this.string('sibAlive');
  this.object('sibDead');
  this.string('sonsAlive');
  this.object('sonsDead')
  this.object('DBTParents');
  this.object('HTAParents');
  this.object('TBCParents');
  this.object('GemelarParents');
  this.object('othersParentsHistory');

  // Antecedentes Personales
  // Hábitos Tóxicos
  this.string('alcohol');
  this.string('snuff');
  this.string('drugs');
  this.string('infusions');

  // Fisiológicos
  this.string('feeding');
  this.string('Dipsia');
  this.string('Diuresis');
  this.string('Catarsis');
  this.string('Somnia');
  this.object('othersPhysiological');

  // Patológicos
  this.string('infancy');
  this.string('adult');
  this.object('DBT');
  this.object('HTA');
  this.object('TBC');
  this.object('Gemelar');
  this.object('othersTreatments');
  this.string('surgical');
  this.string('traumatology');
  this.string('allergy');
  this.object('othersPathological');

  // Gineco-obstéricos
  this.string('FUM');
  this.string('FPP');
  this.string('gestation');
  this.string('menarca');
  this.string('rMenstr');
  this.string('IRS');
  this.number('numberCouples');
  this.string('genitalDischarge');
  this.string('feats');
  this.string('births');
  this.string('caesareans');
  this.string('abortions');
  this.object('contraceptives');
  this.string('lastShow');
  this.string('gynecological');
  this.string('others')

  this.timestamps();
});

module.exports = ClinicHistory;
