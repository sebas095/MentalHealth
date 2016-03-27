function comparePwd(form) {
  if (form.pwd.value && form.cpwd.value) {
    if (form.pwd.value != form.cpwd.value) {
      alert("Las contraseñas no coinciden");
      return false;
    }
    return true;
  }
  if (form.pwd.value || form.pwd.value) {
    alert('Si deseas cambiar de contraseña por favor llena ambos campos');
    return false;
  }
  return true;
}
