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
  if (ok) {
    alert("Pronto le enviaremos un correo con el estado de aprobación de su cuenta");
  }
  return ok;
}
