## RESTful API


| url                     | método   | descripción                | parámetros |
| ----------------------- | -------- | -------------------------- | ------------- |
| /                       | GET      | Muestra el HOME de la app  |               |
| /users/:id              | GET      | retorna el perfil de un usuario | <ul><li>Por definir</li></ul> |
| /users/:id/:rol         | GET      | retorna el perfil de un usuario en el rol seleccionado | <ul><li>Por definir</li></ul> |
| /users/:id/:rol/edit    | GET      | muestra el formulario para modificar la foto del rol de un usuario | <ul><li>Por definir</li></ul> |
| /users/:id/:rol/edit    | PUT      | modifica la foto del rol de un usuario | <ul><li>Por definir</li></ul> |
| /users/:id/edit         | GET      | muestra un formulario con los datos de perfil de un usuario para modificarlos | <ul><li>Por definir</li></ul> |
| /users/:id/edit         | PUT      | modifica los datos de perfil de un usuario | <ul><li>Por definir</li></ul> |
| /users/:id              | DELETE   | borra logicamente un usuario | <ul><li>Por definir</li></ul> |
| /users/new              | GET    | Muestra el formulario de registro | |
| /users/create/user      | POST     | crea un nuevo usuario      | <ul> <li> email </li> <li> name </li> <li> username </li> <li> ... Falta </li> </ul> |
| /users/create/eps       | POST     | crea un nuevo usuario eps     | <ul> <li> email </li> <li> name </li> <li> username </li> <li> ... Falta </li> </ul> |
| /users/create/root      | POST     | crea un usuario root     | <ul> <li> email </li> <li> name </li> <li> username </li> <li> ... Falta </li>
</ul> |
| /users/:id/:rol/calendar | GET      | Muestra la agenda de citas que tiene un usuario | |
| /users/:id/:rol/calendar | POST      | Crea un cita en la agenda de citas | |
| /users/:id/:rol/calendar | PUT     | Modifica un cita en la agenda de citas | |
| /users/:id/:rol/calendar | DELETE     | Elimina un cita en la agenda de citas | |
| /users/:id/:rol/pending | GET | Muestra el el listado de cuentas pendientes por aprobar o rechazar | |
| /users/:id/:rol/allow | GET | Muestra el formulario para aprobar o rechazar cuentas | |
| /users/:id/:rol/allow | POST | permite aprobar o rechazar cuentas (solo lo puede hacer el root y la eps)| |
| /users/:id/recovery | GET | Muestra un formulario para recuperar la contraseña | |
| /users/:id/recovery | POST | Cambia la contraseña de un usuario | |
| /login                  | GET | muestra el fomulario para iniciar sesión | |
| /login                  | POST | iniciar sesión | <ul> <li> username (cédula) </li> <li> password </li> </ul> |
| /logout                 | DELETE | cierra la sesión | |
