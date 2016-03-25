function compare(form) {
  if (form.pwd.value != form.cpwd.value) {
    alert("La contraseñas no coinciden");
    return false;
  }
  alert("Pronto le enviaremos un correo con el estado de aprobación de su cuenta");
  return true;
}
