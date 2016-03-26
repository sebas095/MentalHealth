function allowEps(form) {
  if (!form.aprobarEps.checked && !form.reprobarEps.checked) {
    alert('Por favor seleccione la opción aprobar o rechazar');
    return false;
  }
  if (form.aprobarEps.checked && form.reprobarEps.checked) {
    alert('Por favor seleccione solo la opción de aprobar o rechazar, no selecciones ambas');
    return false;
  }
  return true;
}
