function allowEps(form) {
  if (!form.aprobarEps.checked && !form.reprobarEps.checked) {
    alert('Por favor seleccione la opción aprobar o rechazar');
    return false;
  }
  return true;
}
