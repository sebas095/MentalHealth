function compare(form) {
  if (form.pwd.value != form.cpwd.value) {
    alert("La contraseñas no coinciden");
    return false;
  }
  return true;
}
