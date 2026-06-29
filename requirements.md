# Requerimientos funcionales — EmyTask

EmyTask es una aplicación de gestión de tareas con backend Node.js/Express/MongoDB y frontend React/TypeScript.
Los usuarios se registran, inician sesión y gestionan sus tareas personales. Las tareas tienen estado, prioridad y fecha de vencimiento.
La página de notificaciones agrupa las tareas vencidas, las que vencen hoy y las completadas recientemente.

---

## Módulo: Autenticación

### HU-AUTH-01: Registro de usuario
Como usuario nuevo, quiero poder registrarme con nombre, email y contraseña para crear mi cuenta.

**Reglas:**
- El nombre es obligatorio (mínimo 2 caracteres, máximo 50).
- El email debe tener formato válido y ser único en el sistema.
- La contraseña debe tener mínimo 8 caracteres y máximo 100.
- El frontend pide confirmar la contraseña — ambos campos deben coincidir.
- Al registrarse exitosamente, el sistema devuelve un token JWT y redirige al dashboard.
- Si el email ya está registrado, el sistema devuelve un error 409 con código `EMAIL_ALREADY_EXISTS`.
- Si algún campo falla validación, el sistema devuelve un error 400 con código `VALIDATION_ERROR`.

### HU-AUTH-02: Inicio de sesión
Como usuario registrado, quiero iniciar sesión con mi email y contraseña para acceder a mis tareas.

**Reglas:**
- El email debe tener formato válido.
- La contraseña es obligatoria.
- Si las credenciales son correctas, el sistema devuelve un token JWT y redirige al dashboard.
- Si el email no existe o la contraseña es incorrecta, el sistema devuelve 401 con código `INVALID_CREDENTIALS` (mismo mensaje para ambos casos, por seguridad).
- El frontend almacena el token en `localStorage` bajo la clave `emytask_token`.
- La sesión persiste entre recargas del navegador.
- El botón de submit muestra un spinner mientras se procesa la solicitud.

### HU-AUTH-03: Cierre de sesión
Como usuario autenticado, quiero cerrar sesión para proteger mi cuenta.

**Reglas:**
- Al hacer logout se eliminan `emytask_token` y `emytask_user` del localStorage.
- Tras el logout el usuario es redirigido a `/login`.
- Después del logout no se puede acceder a rutas protegidas.

### HU-AUTH-04: Protección de rutas
Como sistema, debo impedir que usuarios no autenticados accedan a páginas privadas.

**Reglas:**
- Las rutas `/dashboard`, `/tasks` y `/notifications` requieren token válido.
- Un usuario sin token que intenta acceder a una ruta protegida es redirigido a `/login`.
- Un usuario autenticado que visita `/login` o `/register` es redirigido a `/dashboard`.

---

## Módulo: Tareas

### HU-TASK-01: Crear tarea
Como usuario autenticado, quiero crear una tarea para registrar algo que debo hacer.

**Reglas:**
- El título es obligatorio (mínimo 1 carácter, máximo 100).
- La descripción es opcional (máximo 500 caracteres).
- El estado por defecto es `pending` si no se especifica. Valores válidos: `pending`, `in_progress`, `completed`.
- La prioridad por defecto es `medium` si no se especifica. Valores válidos: `low`, `medium`, `high`.
- La fecha de vencimiento es opcional y debe estar en formato ISO 8601.
- La tarea creada queda asociada al usuario autenticado.
- Si el título está vacío, el sistema devuelve 400 con `VALIDATION_ERROR`.
- El endpoint es `POST /api/v1/tasks` y devuelve 201 con la tarea creada.

### HU-TASK-02: Listar tareas
Como usuario autenticado, quiero ver todas mis tareas para tener una visión general.

**Reglas:**
- El endpoint es `GET /api/v1/tasks` y devuelve solo las tareas del usuario autenticado.
- Soporta filtro por `status` (`pending`, `in_progress`, `completed`).
- Soporta filtro por `priority` (`low`, `medium`, `high`).
- Los filtros se pueden combinar (status AND priority).
- Soporta paginación con parámetros `page` (mínimo 1, default 1) y `limit` (mínimo 1, máximo 50, default 10).
- La respuesta incluye metadatos: `page`, `limit`, `total`, `totalPages`.
- Un usuario nunca ve tareas de otros usuarios.

### HU-TASK-03: Ver detalle de una tarea
Como usuario autenticado, quiero ver los detalles completos de una tarea específica.

**Reglas:**
- El endpoint es `GET /api/v1/tasks/:id`.
- Si la tarea no existe o pertenece a otro usuario, el sistema devuelve 404 con `NOT_FOUND`.

### HU-TASK-04: Editar tarea
Como usuario autenticado, quiero editar una tarea existente para actualizar su información.

**Reglas:**
- El endpoint es `PATCH /api/v1/tasks/:id`.
- Todos los campos son opcionales (actualización parcial).
- El título, si se provee, debe tener entre 1 y 100 caracteres.
- La descripción puede establecerse en `null` para borrarla.
- La fecha de vencimiento puede establecerse en `null` para borrarla.
- El campo `updatedAt` se actualiza automáticamente.
- Si la tarea no existe o pertenece a otro usuario, el sistema devuelve 404.

### HU-TASK-05: Eliminar tarea
Como usuario autenticado, quiero eliminar una tarea que ya no necesito.

**Reglas:**
- El endpoint es `DELETE /api/v1/tasks/:id`.
- La eliminación es permanente.
- Si la tarea no existe o pertenece a otro usuario, el sistema devuelve 404.
- El sistema devuelve 200 con `{ success: true, data: null, message: "Task deleted successfully" }`.

---

## Módulo: Interfaz de tareas (Frontend)

### HU-UI-TASK-01: Página de tareas
Como usuario, quiero gestionar mis tareas desde una interfaz visual.

**Reglas:**
- La página `/tasks` muestra las tareas en una cuadrícula de 2 columnas.
- Cada tarjeta muestra: título, descripción (truncada), badge de estado, badge de prioridad y fecha de vencimiento (si existe).
- El header muestra el total de tareas con formato "X tareas en total".
- El botón "Nueva tarea" abre un modal con el formulario vacío.
- El botón de edición (ícono lápiz) abre el modal con los datos de la tarea precargados.
- El botón de eliminación (ícono papelera) abre un modal de confirmación con el nombre de la tarea.
- Confirmar la eliminación borra la tarea y muestra un toast "Tarea eliminada".
- Los estados de los badges son: Pendiente (amarillo), En progreso (azul), Completada (verde).
- Las prioridades tienen puntos de color: Baja (verde), Media (amarillo), Alta (rosa).

### HU-UI-TASK-02: Filtros de tareas
Como usuario, quiero filtrar mis tareas por estado y prioridad para encontrar las que necesito.

**Reglas:**
- Hay un selector de estado: "Todos los estados", "Pendiente", "En progreso", "Completada".
- Hay un selector de prioridad: "Todas las prioridades", "Baja", "Media", "Alta".
- Al aplicar un filtro, la lista se recarga desde página 1 con el filtro activo.
- El botón "Limpiar filtros" aparece cuando hay algún filtro activo y al pulsarlo muestra todas las tareas.
- Si no hay tareas con los filtros aplicados, se muestra un mensaje indicando que no hay resultados con ese filtro.
- Si no hay tareas en total, se muestra el mensaje "Aún no tienes tareas. ¡Crea la primera!".

### HU-UI-TASK-03: Paginación de tareas
Como usuario, quiero navegar entre páginas cuando tengo muchas tareas.

**Reglas:**
- Los controles de paginación aparecen cuando el total supera el límite de página.
- Se muestran botones "← Anterior" y "Siguiente →" junto al indicador "Página X de Y".
- El botón "← Anterior" está deshabilitado en la primera página.
- El botón "Siguiente →" está deshabilitado en la última página.

---

## Módulo: Notificaciones

### HU-NOTIF-01: Página de notificaciones
Como usuario, quiero ver un resumen de mis tareas agrupadas por alertas para saber qué necesita atención.

**Reglas:**
- La página `/notifications` tiene tres secciones: "Tareas vencidas", "Vencen hoy" y "Completadas recientemente".
- Cada sección tiene un header con ícono, título y badge con el conteo de tareas.
- Si una sección no tiene tareas, muestra un mensaje de estado vacío.

### HU-NOTIF-02: Tareas vencidas
Como usuario, quiero ver las tareas cuya fecha de vencimiento ya pasó y no están completadas.

**Reglas:**
- Una tarea aparece en esta sección si `dueDate < hoy` Y `status !== completed`.
- Las tarjetas tienen fondo con gradiente rojo/rosa y borde rojo.
- El badge de estado muestra "Vencida".
- Si no hay tareas vencidas, se muestra "Sin tareas vencidas, lo estás haciendo genial".

### HU-NOTIF-03: Tareas que vencen hoy
Como usuario, quiero ver las tareas que tienen fecha límite hoy y no están completadas.

**Reglas:**
- Una tarea aparece en esta sección si `dueDate === hoy` Y `status !== completed`.
- Las tarjetas tienen fondo con gradiente amarillo/ámbar.
- El badge de estado muestra "Vence hoy".
- Si no hay tareas para hoy, se muestra "No hay tareas con fecha límite para hoy".

### HU-NOTIF-04: Tareas completadas recientemente
Como usuario, quiero ver las tareas que completé recientemente para hacer seguimiento de mi progreso.

**Reglas:**
- Muestra hasta 6 tareas más recientes con `status === completed`.
- Las tarjetas tienen fondo con gradiente verde/esmeralda.
- El badge de estado muestra "Completada".
- Si no hay tareas completadas, se muestra "Aún no has completado ninguna tarea".

---

## Módulo: API — Seguridad y acceso

### HU-SEC-01: Autenticación en endpoints protegidos
Como sistema, debo rechazar solicitudes sin token válido a los endpoints de tareas.

**Reglas:**
- Todos los endpoints `/api/v1/tasks/*` requieren header `Authorization: Bearer <token>`.
- Sin token o con token inválido, el sistema devuelve 401.

### HU-SEC-02: Aislamiento de datos entre usuarios
Como usuario, no debo poder ver, editar ni eliminar las tareas de otros usuarios.

**Reglas:**
- `GET /api/v1/tasks/:id` de una tarea ajena devuelve 404.
- `PATCH /api/v1/tasks/:id` de una tarea ajena devuelve 404.
- `DELETE /api/v1/tasks/:id` de una tarea ajena devuelve 404.
- `GET /api/v1/tasks` solo devuelve tareas del usuario autenticado, nunca de otros.
