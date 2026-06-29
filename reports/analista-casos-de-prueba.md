# Casos de prueba — EmyTask
*Generados desde requirements.md*

---

## Módulo: Autenticación — Registro

### CP-01: Registro exitoso con datos válidos
**Prioridad:** crítico
**Módulo:** auth
**Tipo:** UI+API
**Precondiciones:** El email no existe en la base de datos.
**Pasos:**
1. Navegar a `/register`.
2. Ingresar nombre válido (ej. "Ana López").
3. Ingresar email válido (ej. "ana@test.com").
4. Ingresar contraseña de mínimo 8 caracteres.
5. Repetir la misma contraseña en el campo de confirmación.
6. Hacer clic en el botón de registro.
**Resultado esperado:** El usuario es redirigido a `/dashboard`, se muestra un toast de éxito y el token queda almacenado en `localStorage.emytask_token`.

---

### CP-02: Registro con email ya registrado
**Prioridad:** crítico
**Módulo:** auth
**Tipo:** UI+API
**Precondiciones:** El email "existente@test.com" ya tiene una cuenta.
**Pasos:**
1. Navegar a `/register`.
2. Completar el formulario con el email "existente@test.com".
3. Hacer clic en el botón de registro.
**Resultado esperado:** Se muestra un toast de error con mensaje sobre email duplicado. El usuario permanece en `/register`.

---

### CP-03: Registro con contraseñas que no coinciden
**Prioridad:** alto
**Módulo:** auth
**Tipo:** UI
**Precondiciones:** Ninguna.
**Pasos:**
1. Navegar a `/register`.
2. Ingresar nombre y email válidos.
3. Ingresar "password123" en el campo contraseña.
4. Ingresar "diferente456" en el campo confirmar contraseña.
5. Hacer clic en el botón de registro.
**Resultado esperado:** Se muestra un mensaje de error indicando que las contraseñas no coinciden. No se realiza ninguna petición al servidor.

---

### CP-04: Registro con contraseña menor a 8 caracteres
**Prioridad:** alto
**Módulo:** auth
**Tipo:** UI+API
**Precondiciones:** Ninguna.
**Pasos:**
1. Navegar a `/register`.
2. Ingresar nombre y email válidos.
3. Ingresar "abc123" como contraseña (6 caracteres).
4. Repetir la misma en confirmación.
5. Hacer clic en el botón de registro.
**Resultado esperado:** Se muestra mensaje de error de validación. El registro no se completa.

---

### CP-05: Registro con nombre vacío
**Prioridad:** alto
**Módulo:** auth
**Tipo:** UI
**Precondiciones:** Ninguna.
**Pasos:**
1. Navegar a `/register`.
2. Dejar el campo nombre vacío.
3. Completar email y contraseña válidos.
4. Hacer clic en el botón de registro.
**Resultado esperado:** Se muestra mensaje de error en el campo nombre. No se realiza petición al servidor.

---

### CP-06: Registro con email con formato inválido
**Prioridad:** medio
**Módulo:** auth
**Tipo:** UI
**Precondiciones:** Ninguna.
**Pasos:**
1. Navegar a `/register`.
2. Ingresar "email-sin-arroba" en el campo email.
3. Completar los demás campos correctamente.
4. Hacer clic en el botón de registro.
**Resultado esperado:** Se muestra mensaje de error de formato de email. No se realiza petición al servidor.

---

### CP-07: Botón de registro muestra spinner durante la carga
**Prioridad:** bajo
**Módulo:** auth
**Tipo:** UI
**Precondiciones:** Ninguna.
**Pasos:**
1. Navegar a `/register`.
2. Completar todos los campos con datos válidos.
3. Hacer clic en el botón de registro y observar inmediatamente.
**Resultado esperado:** El botón muestra un indicador de carga (spinner) mientras se procesa la solicitud.

---

## Módulo: Autenticación — Login

### CP-08: Login exitoso con credenciales válidas
**Prioridad:** crítico
**Módulo:** auth
**Tipo:** UI+API
**Precondiciones:** Existe una cuenta con email "usuario@test.com" y contraseña "password123".
**Pasos:**
1. Navegar a `/login`.
2. Ingresar "usuario@test.com" en el campo email.
3. Ingresar "password123" en el campo contraseña.
4. Hacer clic en el botón de login.
**Resultado esperado:** Se muestra toast de bienvenida, el usuario es redirigido a `/dashboard` y el token queda en `localStorage.emytask_token`.

---

### CP-09: Login con contraseña incorrecta
**Prioridad:** crítico
**Módulo:** auth
**Tipo:** UI+API
**Precondiciones:** Existe una cuenta con email "usuario@test.com".
**Pasos:**
1. Navegar a `/login`.
2. Ingresar "usuario@test.com" y una contraseña incorrecta.
3. Hacer clic en el botón de login.
**Resultado esperado:** Se muestra toast de error con mensaje genérico de credenciales inválidas. El usuario permanece en `/login`.

---

### CP-10: Login con email no registrado
**Prioridad:** alto
**Módulo:** auth
**Tipo:** UI+API
**Precondiciones:** El email "noexiste@test.com" no está registrado.
**Pasos:**
1. Navegar a `/login`.
2. Ingresar "noexiste@test.com" y cualquier contraseña.
3. Hacer clic en el botón de login.
**Resultado esperado:** Se muestra el mismo mensaje de error genérico que para contraseña incorrecta (sin revelar si el email existe).

---

### CP-11: Login con campos vacíos
**Prioridad:** medio
**Módulo:** auth
**Tipo:** UI
**Precondiciones:** Ninguna.
**Pasos:**
1. Navegar a `/login`.
2. Dejar ambos campos vacíos.
3. Hacer clic en el botón de login.
**Resultado esperado:** Se muestran mensajes de validación en los campos requeridos. No se realiza petición al servidor.

---

### CP-12: Sesión persiste tras recargar el navegador
**Prioridad:** alto
**Módulo:** auth
**Tipo:** UI
**Precondiciones:** El usuario está autenticado en `/dashboard`.
**Pasos:**
1. Recargar la página con F5.
**Resultado esperado:** El usuario permanece en `/dashboard` sin ser redirigido a `/login`.

---

## Módulo: Autenticación — Logout y rutas protegidas

### CP-13: Logout elimina la sesión y redirige a login
**Prioridad:** crítico
**Módulo:** auth
**Tipo:** UI
**Precondiciones:** El usuario está autenticado.
**Pasos:**
1. Hacer clic en el botón de logout (sidebar o header).
**Resultado esperado:** `localStorage.emytask_token` y `localStorage.emytask_user` son eliminados. El usuario es redirigido a `/login`.

---

### CP-14: Ruta protegida sin token redirige a login
**Prioridad:** crítico
**Módulo:** auth
**Tipo:** UI
**Precondiciones:** No hay token en localStorage.
**Pasos:**
1. Navegar directamente a `/tasks`.
**Resultado esperado:** El usuario es redirigido a `/login` sin ver el contenido de la página.

---

### CP-15: Usuario autenticado no puede acceder a /login
**Prioridad:** medio
**Módulo:** auth
**Tipo:** UI
**Precondiciones:** El usuario está autenticado.
**Pasos:**
1. Navegar directamente a `/login`.
**Resultado esperado:** El usuario es redirigido a `/dashboard`.

---

## Módulo: Tareas — API

### CP-16: Crear tarea solo con título (mínimo requerido)
**Prioridad:** crítico
**Módulo:** tasks
**Tipo:** API
**Precondiciones:** Usuario autenticado con token válido.
**Pasos:**
1. Enviar `POST /api/v1/tasks` con `{ "title": "Mi tarea" }` y header de autorización.
**Resultado esperado:** Respuesta 201. La tarea creada tiene `status: "pending"`, `priority: "medium"` y pertenece al usuario autenticado.

---

### CP-17: Crear tarea con todos los campos
**Prioridad:** alto
**Módulo:** tasks
**Tipo:** API
**Precondiciones:** Usuario autenticado.
**Pasos:**
1. Enviar `POST /api/v1/tasks` con título, descripción, `status: "in_progress"`, `priority: "high"` y `dueDate` válido.
**Resultado esperado:** Respuesta 201 con todos los campos guardados correctamente.

---

### CP-18: Crear tarea sin título devuelve error 400
**Prioridad:** crítico
**Módulo:** tasks
**Tipo:** API
**Precondiciones:** Usuario autenticado.
**Pasos:**
1. Enviar `POST /api/v1/tasks` con `{ "description": "Sin título" }`.
**Resultado esperado:** Respuesta 400 con código `VALIDATION_ERROR`.

---

### CP-19: Crear tarea sin token devuelve 401
**Prioridad:** crítico
**Módulo:** tasks
**Tipo:** API
**Precondiciones:** Ninguna.
**Pasos:**
1. Enviar `POST /api/v1/tasks` sin header `Authorization`.
**Resultado esperado:** Respuesta 401.

---

### CP-20: Listar tareas devuelve solo las del usuario autenticado
**Prioridad:** crítico
**Módulo:** tasks
**Tipo:** API
**Precondiciones:** Existen tareas de dos usuarios diferentes en la base de datos.
**Pasos:**
1. Autenticarse como Usuario A.
2. Enviar `GET /api/v1/tasks`.
**Resultado esperado:** Solo se devuelven las tareas del Usuario A. No aparecen tareas del Usuario B.

---

### CP-21: Listar tareas con filtro por estado
**Prioridad:** alto
**Módulo:** tasks
**Tipo:** API
**Precondiciones:** Usuario autenticado con tareas en distintos estados.
**Pasos:**
1. Enviar `GET /api/v1/tasks?status=completed`.
**Resultado esperado:** Solo se devuelven tareas con `status: "completed"`.

---

### CP-22: Listar tareas con paginación
**Prioridad:** alto
**Módulo:** tasks
**Tipo:** API
**Precondiciones:** Usuario autenticado con más de 10 tareas.
**Pasos:**
1. Enviar `GET /api/v1/tasks?page=1&limit=5`.
**Resultado esperado:** Respuesta con exactamente 5 tareas, y `meta.limit=5`, `meta.page=1`, `meta.total` con el total real, `meta.totalPages` calculado correctamente.

---

### CP-23: Obtener tarea ajena devuelve 404
**Prioridad:** crítico
**Módulo:** tasks
**Tipo:** API
**Precondiciones:** Existen tareas de dos usuarios. Usuario A tiene token válido. `taskId` pertenece al Usuario B.
**Pasos:**
1. Enviar `GET /api/v1/tasks/:taskId` autenticado como Usuario A.
**Resultado esperado:** Respuesta 404 con código `NOT_FOUND`.

---

### CP-24: Actualizar tarea parcialmente
**Prioridad:** alto
**Módulo:** tasks
**Tipo:** API
**Precondiciones:** Usuario autenticado. Existe una tarea propia con estado `pending`.
**Pasos:**
1. Enviar `PATCH /api/v1/tasks/:id` con `{ "status": "completed" }`.
**Resultado esperado:** Respuesta 200. Solo el campo `status` cambió. Los demás campos permanecen igual. `updatedAt` se actualiza.

---

### CP-25: Actualizar tarea con dueDate nulo borra la fecha
**Prioridad:** medio
**Módulo:** tasks
**Tipo:** API
**Precondiciones:** Tarea con `dueDate` definido.
**Pasos:**
1. Enviar `PATCH /api/v1/tasks/:id` con `{ "dueDate": null }`.
**Resultado esperado:** Respuesta 200. La tarea ya no tiene `dueDate`.

---

### CP-26: Actualizar tarea ajena devuelve 404
**Prioridad:** crítico
**Módulo:** tasks
**Tipo:** API
**Precondiciones:** `taskId` pertenece al Usuario B. Se usa token del Usuario A.
**Pasos:**
1. Enviar `PATCH /api/v1/tasks/:taskId` con cualquier campo.
**Resultado esperado:** Respuesta 404.

---

### CP-27: Eliminar tarea propia
**Prioridad:** crítico
**Módulo:** tasks
**Tipo:** API
**Precondiciones:** Usuario autenticado con una tarea propia.
**Pasos:**
1. Enviar `DELETE /api/v1/tasks/:id`.
**Resultado esperado:** Respuesta 200 con `{ success: true, data: null }`. La tarea ya no existe en la base de datos.

---

### CP-28: Eliminar tarea ajena devuelve 404
**Prioridad:** crítico
**Módulo:** tasks
**Tipo:** API
**Precondiciones:** `taskId` pertenece al Usuario B. Se usa token del Usuario A.
**Pasos:**
1. Enviar `DELETE /api/v1/tasks/:taskId`.
**Resultado esperado:** Respuesta 404.

---

## Módulo: Tareas — Interfaz de usuario

### CP-29: Crear tarea desde el modal con datos completos
**Prioridad:** crítico
**Módulo:** tasks
**Tipo:** UI
**Precondiciones:** Usuario autenticado en `/tasks`.
**Pasos:**
1. Hacer clic en "Nueva tarea".
2. Ingresar título, descripción, seleccionar estado "En progreso", prioridad "Alta" y una fecha de vencimiento.
3. Hacer clic en "Crear tarea".
**Resultado esperado:** El modal se cierra, aparece un toast "Tarea creada" y la nueva tarea aparece en la cuadrícula con los datos correctos.

---

### CP-30: No se puede crear tarea sin título desde la UI
**Prioridad:** crítico
**Módulo:** tasks
**Tipo:** UI
**Precondiciones:** Usuario autenticado en `/tasks`. Modal de nueva tarea abierto.
**Pasos:**
1. Dejar el campo título vacío.
2. Hacer clic en "Crear tarea".
**Resultado esperado:** Se muestra un mensaje de error en el campo título. El modal no se cierra.

---

### CP-31: Editar tarea desde el modal carga los datos actuales
**Prioridad:** alto
**Módulo:** tasks
**Tipo:** UI
**Precondiciones:** Existe al menos una tarea visible en la cuadrícula.
**Pasos:**
1. Hacer clic en el botón de edición (ícono lápiz) de una tarea.
**Resultado esperado:** El modal se abre con todos los campos precargados con los valores actuales de esa tarea.

---

### CP-32: Guardar cambios en edición actualiza la tarjeta
**Prioridad:** alto
**Módulo:** tasks
**Tipo:** UI
**Precondiciones:** Modal de edición abierto con una tarea.
**Pasos:**
1. Cambiar el título a "Título actualizado".
2. Hacer clic en "Guardar cambios".
**Resultado esperado:** El modal se cierra, se muestra toast "Tarea actualizada" y la tarjeta en la cuadrícula muestra el nuevo título.

---

### CP-33: Eliminar tarea muestra confirmación con el nombre
**Prioridad:** alto
**Módulo:** tasks
**Tipo:** UI
**Precondiciones:** Existe una tarea con título "Tarea importante".
**Pasos:**
1. Hacer clic en el botón de eliminar (ícono papelera) de la tarea.
**Resultado esperado:** Aparece un modal de confirmación con el texto 'Se eliminará "Tarea importante" permanentemente.'

---

### CP-34: Cancelar eliminación no borra la tarea
**Prioridad:** medio
**Módulo:** tasks
**Tipo:** UI
**Precondiciones:** Modal de confirmación de eliminación abierto.
**Pasos:**
1. Hacer clic en "Cancelar".
**Resultado esperado:** El modal se cierra y la tarea sigue visible en la cuadrícula.

---

### CP-35: Filtrar por estado muestra solo tareas del estado seleccionado
**Prioridad:** alto
**Módulo:** tasks
**Tipo:** UI
**Precondiciones:** El usuario tiene tareas en distintos estados.
**Pasos:**
1. Seleccionar "Completada" en el selector de estado.
**Resultado esperado:** Solo se muestran tarjetas con badge "Completada". El total en el header refleja solo esas tareas.

---

### CP-36: Limpiar filtros restaura la vista completa
**Prioridad:** alto
**Módulo:** tasks
**Tipo:** UI
**Precondiciones:** Hay un filtro activo aplicado.
**Pasos:**
1. Hacer clic en "Limpiar filtros".
**Resultado esperado:** El botón "Limpiar filtros" desaparece, los selectores vuelven a "Todos" y se muestran todas las tareas.

---

### CP-37: Estado vacío sin tareas muestra mensaje invitando a crear
**Prioridad:** medio
**Módulo:** tasks
**Tipo:** UI
**Precondiciones:** El usuario no tiene ninguna tarea creada.
**Pasos:**
1. Navegar a `/tasks`.
**Resultado esperado:** Se muestra el mensaje "Aún no tienes tareas. ¡Crea la primera!" en lugar de la cuadrícula.

---

### CP-38: Paginación navega correctamente entre páginas
**Prioridad:** medio
**Módulo:** tasks
**Tipo:** UI
**Precondiciones:** El usuario tiene más tareas que el límite por página (más de 10).
**Pasos:**
1. Verificar que el botón "← Anterior" está deshabilitado en la primera página.
2. Hacer clic en "Siguiente →".
3. Verificar que el indicador muestra "Página 2 de X".
4. Hacer clic en "← Anterior".
5. Verificar que regresa a "Página 1 de X".
**Resultado esperado:** La navegación entre páginas funciona correctamente y los botones se deshabilitan en los extremos.

---

## Módulo: Notificaciones

### CP-39: La página de notificaciones muestra las tres secciones
**Prioridad:** crítico
**Módulo:** notifications
**Tipo:** UI
**Precondiciones:** Usuario autenticado.
**Pasos:**
1. Navegar a `/notifications`.
**Resultado esperado:** Se muestran las secciones "Tareas vencidas", "Vencen hoy" y "Completadas recientemente".

---

### CP-40: Tarea vencida aparece en la sección "Tareas vencidas"
**Prioridad:** crítico
**Módulo:** notifications
**Tipo:** UI+API
**Precondiciones:** Existe una tarea con `dueDate` en el pasado y `status !== completed`.
**Pasos:**
1. Navegar a `/notifications`.
2. Observar la sección "Tareas vencidas".
**Resultado esperado:** La tarea aparece en esa sección con badge "Vencida". El conteo del header es mayor que 0.

---

### CP-41: Tarea con dueDate hoy aparece en "Vencen hoy"
**Prioridad:** crítico
**Módulo:** notifications
**Tipo:** UI+API
**Precondiciones:** Existe una tarea con `dueDate` igual a la fecha de hoy y `status !== completed`.
**Pasos:**
1. Navegar a `/notifications`.
2. Observar la sección "Vencen hoy".
**Resultado esperado:** La tarea aparece en esa sección con badge "Vence hoy". El conteo del header es mayor que 0.

---

### CP-42: Tarea completada aparece en "Completadas recientemente"
**Prioridad:** crítico
**Módulo:** notifications
**Tipo:** UI+API
**Precondiciones:** Existe al menos una tarea con `status: "completed"`.
**Pasos:**
1. Navegar a `/notifications`.
2. Observar la sección "Completadas recientemente".
**Resultado esperado:** La tarea aparece en esa sección con badge "Completada". El conteo del header es mayor que 0.

---

### CP-43: Tarea completada no aparece en secciones vencidas ni vence hoy
**Prioridad:** alto
**Módulo:** notifications
**Tipo:** UI+API
**Precondiciones:** Existe una tarea con `dueDate` en el pasado y `status: "completed"`.
**Pasos:**
1. Navegar a `/notifications`.
**Resultado esperado:** La tarea no aparece en "Tareas vencidas" ni en "Vencen hoy". Solo aparece en "Completadas recientemente".

---

### CP-44: Secciones vacías muestran mensaje en cero tareas
**Prioridad:** alto
**Módulo:** notifications
**Tipo:** UI
**Precondiciones:** El usuario no tiene tareas de ningún tipo.
**Pasos:**
1. Navegar a `/notifications`.
**Resultado esperado:**
- "Tareas vencidas" muestra "Sin tareas vencidas, lo estás haciendo genial".
- "Vencen hoy" muestra "No hay tareas con fecha límite para hoy".
- "Completadas recientemente" muestra "Aún no has completado ninguna tarea".
- Todos los badges de conteo muestran 0.

---

### CP-45: Sección "Completadas" muestra máximo 6 tareas
**Prioridad:** medio
**Módulo:** notifications
**Tipo:** UI+API
**Precondiciones:** El usuario tiene más de 6 tareas completadas.
**Pasos:**
1. Navegar a `/notifications`.
2. Contar las tarjetas en la sección "Completadas recientemente".
**Resultado esperado:** Se muestran exactamente 6 tarjetas (las más recientes).

---

### CP-46: Página de notificaciones es accesible desde el sidebar
**Prioridad:** alto
**Módulo:** notifications
**Tipo:** UI
**Precondiciones:** Usuario autenticado en cualquier página.
**Pasos:**
1. Hacer clic en el enlace de notificaciones en el sidebar.
**Resultado esperado:** El usuario navega a `/notifications` y la página se carga correctamente.

---

## Resumen

| Módulo | Total | Críticos | Altos | Medios | Bajos |
|---|---|---|---|---|---|
| auth (registro) | 7 | 2 | 3 | 1 | 1 |
| auth (login) | 5 | 2 | 2 | 1 | 0 |
| auth (logout/rutas) | 3 | 2 | 1 | 0 | 0 |
| tasks (API) | 13 | 7 | 4 | 2 | 0 |
| tasks (UI) | 10 | 3 | 5 | 2 | 0 |
| notifications | 8 | 4 | 3 | 1 | 0 |
| **Total** | **46** | **20** | **18** | **7** | **1** |

### Casos críticos a automatizar primero
1. CP-01 — Registro exitoso (flujo base de toda la suite)
2. CP-08 — Login exitoso (prerequisito de todos los tests protegidos)
3. CP-16 — Crear tarea (operación core)
4. CP-19 — Crear tarea sin token → 401 (seguridad)
5. CP-20 — Aislamiento de datos entre usuarios (seguridad)
6. CP-23 — GET tarea ajena → 404 (seguridad)
7. CP-26 — PATCH tarea ajena → 404 (seguridad)
8. CP-28 — DELETE tarea ajena → 404 (seguridad)
9. CP-14 — Ruta protegida sin token → redirect login
10. CP-39 — Notificaciones muestra tres secciones

### Flujos que requieren datos especiales de prueba
- **CP-40, CP-41**: Necesitan tareas con `dueDate` exacto (pasado / hoy) → usar `DataHelper` con fechas calculadas.
- **CP-45**: Necesita crear más de 6 tareas completadas → crear con `DataHelper` en `beforeAll`.
- **CP-20, CP-23, CP-26, CP-28**: Necesitan dos usuarios con tareas diferentes → crear ambos usuarios con `DataHelper`.
- **CP-38**: Necesita más de 10 tareas → crear en `beforeAll` con loop.
