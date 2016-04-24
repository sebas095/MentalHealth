function checkedDeleted(name) {
  var msj = confirm("¿Esta seguro que desea eliminar su " + name + "?");
  if (msj == true) {
    return true;
  }
  return false;
}
