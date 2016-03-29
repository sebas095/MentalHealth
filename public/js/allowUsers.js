function allowUsers(form) {
  if (form.aprobarpaciente) {
    if (!form.aprobarpaciente.checked && !form.rechazarpaciente.checked) {
      alert('Por favor seleccione la opción aprobar o rechazar');
      return false;
    }
    if (form.aprobarpaciente.checked && form.rechazarpaciente.checked) {
      alert('Por favor solo seleccione en cada rol la opción de aprobar o rechazar, no selecciones ambas');
      return false;
    }
  }

  if (form.aprobarmedicoGeneral) {
    if (!form.aprobarmedicoGeneral.checked && !form.rechazarmedicoGeneral.checked) {
      alert('Por favor seleccione la opción aprobar o rechazar');
      return false;
    }
    if (form.aprobarmedicoGeneral.checked && form.rechazarmedicoGeneral.checked) {
      alert('Por favor solo seleccione en cada rol la opción de aprobar o rechazar, no selecciones ambas');
      return false;
    }
  }

  if (form.aprobarmedicoEspecialista) {
    if (!form.aprobarmedicoEspecialista.checked && !form.rechazarmedicoEspecialista.checked) {
      alert('Por favor seleccione la opción aprobar o rechazar');
      return false;
    }
    if (form.aprobarmedicoEspecialista.checked && form.rechazarmedicoEspecialista.checked) {
      alert('Por favor solo seleccione en cada rol la opción de aprobar o rechazar, no selecciones ambas');
      return false;
    }
  }

  return true;
}
