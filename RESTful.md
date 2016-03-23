## RESTful API


| url                     | método   | descripción                | parámetros |
| ----------------------- | -------- | -------------------------- | ------------- |
| /                       | GET      | Muestra el HOME de la app  |               |
| /users/:id/:rol         | GET      | retorna el perfil de un usuario en el rol seleccionado | <ul><li>Por definir</li></ul> |
| /users/:id/:rol/edit    | PUT      | modifica el perfil de un usuario en el rol seleccionado | <ul><li>Por definir</li></ul> |
| /users/:id              | DELETE   | borra logicamente un usuario | <ul><li>Por definir</li></ul> |
| /users/new              | POST     | crea un nuevo usuario      | <ul> <li> email </li> <li> name </li> <li> username </li> <li> ... Falta </li> </ul> |
| /users/:id/:rol/calendar | GET      | Muestra la agenda de citas que tiene un usuario | |
| /users/:id/:rol/calendar | POST      | Crea un cita en la agenda de citas | |
| /users/:id/:rol/calendar | PUT     | Modifica un cita en la agenda de citas | |
| /users/:id/:rol/calendar | DELETE     | Elimina un cita en la agenda de citas | |
| /login                  | GET | muestra el fomulario para iniciar sesión | |
| /login                  | POST | iniciar sesión | <ul> <li> username (cédula) </li> <li> password </li> </ul> |
