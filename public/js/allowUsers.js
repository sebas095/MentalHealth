function allowUsers(form) {
  if (form.aprobarpaciente) {
    if (!form.aprobarpaciente.checked && !form.rechazarpaciente.checked) {
      alert('Por favor seleccione la opción aprobar o rechazar');
      return false;
    }
  }

  if (form.aprobarmedicoGeneral) {
    if (!form.aprobarmedicoGeneral.checked && !form.rechazarmedicoGeneral.checked) {
      alert('Por favor seleccione la opción aprobar o rechazar');
      return false;
    }
  }

  if (form.aprobarmedicoEspecialista) {
    if (!form.aprobarmedicoEspecialista.checked && !form.rechazarmedicoEspecialista.checked) {
      alert('Por favor seleccione la opción aprobar o rechazar');
      return false;
    }
  }

  return true;
}
