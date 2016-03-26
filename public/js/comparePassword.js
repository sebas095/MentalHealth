function compare(form, rol) {
  if (form.pwd.value != form.cpwd.value) {
    alert("Las contraseñas no coinciden");
    return false;
  }
  if (rol)               alert("Pronto le enviaremos un correo con el estado de aprobación de su cuenta");
  else if (rol == false) alert("El usuario Root ha sido creado con éxito!");
  return true;
}
