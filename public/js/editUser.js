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

function checkDate(form, rol) {
  if (form.birthdate.value) {
    if (rol == 'user') {
      var currentYear = new Date(Date.now()).getFullYear();
      var birthdate = Number((form.birthdate.value).split('-')[0]);

      if (currentYear - birthdate >= 3) return true;
      else {
        alert('Por favor ingresa una fecha válida');
        return false;
      }
    }
    else {
      if (rol.name == 'eps') return true;
      else {
        var currentYear = new Date(Date.now()).getFullYear();
        var birthdate = Number((form.birthdate.value).split('-')[0]);
        if (currentYear - birthdate >= 18) return true;
        else {
          alert('Por favor ingresa una fecha válida');
          return false;
        }
      }
    }
  }
  return true;
}
