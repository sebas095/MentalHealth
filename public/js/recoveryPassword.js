function comparePass(form) {
  if (form.pwd.value != form.cpwd.value) {
    alert("Las contraseñas no coinciden");
    return false;
  }
  return true;
}
