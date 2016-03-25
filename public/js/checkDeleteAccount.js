function checkedDeleted() {
  var msj = confirm("¿Esta seguro que desea eliminar su cuenta?");
  if (msj == true) {
    return true;
  }
  return false;
}
