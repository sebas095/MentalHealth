function checkForm(form) {
  var ok = true;
  if (!form.paciente.checked && !form.medicoGeneral.checked && !form.medicoEspecialista.checked) {
    alert("Por favor selecciona al menos un rol");
    ok = false;
  }
  if (form.pwd.value != form.cpwd.value) {
    alert("La contraseñas no coinciden");
    ok = false;
  }
  return ok;
}
