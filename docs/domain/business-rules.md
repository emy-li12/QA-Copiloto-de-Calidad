# Reglas de negocio — EmyTask

## Autenticación

### Registro (`POST /api/v1/auth/register`)
| Campo      | Regla                                       | Error si falla              |
|------------|---------------------------------------------|-----------------------------|
| `name`     | requerido, 2–50 chars                       | 400 `BAD_REQUEST`            |
| `email`    | requerido, formato válido, único            | 400 o 409 `CONFLICT`         |
| `password` | requerido, 8–100 chars                      | 400 `BAD_REQUEST`            |

- Si el email ya existe → **409 CONFLICT**.
- Al registrar exitosamente → devuelve `{ token, user: { id, name, email } }`.

### Login (`POST /api/v1/auth/login`)
| Campo      | Regla                            | Error si falla           |
|------------|----------------------------------|--------------------------|
| `email`    | requerido, formato válido        | 400 `BAD_REQUEST`         |
| `password` | requerido (mínimo 1 char)        | 400 `BAD_REQUEST`         |

- Email no existe → **401 UNAUTHORIZED**.
- Password incorrecto → **401 UNAUTHORIZED**.
- Éxito → devuelve `{ token, user: { id, name, email } }`.

### JWT
- El token se almacena en `localStorage` bajo la clave `emytask_token`.
- Los datos del usuario se almacenan en `localStorage` bajo `emytask_user`.
- Todas las rutas de tareas requieren `Authorization: Bearer <token>`.
- Token inválido/ausente → **401 UNAUTHORIZED**.

---

## Tareas

### Crear tarea (`POST /api/v1/tasks`)
| Campo         | Regla                                             |
|---------------|---------------------------------------------------|
| `title`       | requerido, 1–100 chars                            |
| `description` | opcional, máx 500 chars                           |
| `status`      | opcional; `pending` · `in_progress` · `completed` |
| `priority`    | opcional; `low` · `medium` · `high`               |
| `dueDate`     | opcional, fecha ISO 8601                          |

- Éxito → **201 Created** con la tarea creada.
- Título vacío → **400** con error de validación.

### Listar tareas (`GET /api/v1/tasks`)
- Solo devuelve las tareas del usuario autenticado.
- Filtros opcionales: `status`, `priority`.
- Paginación: `page` (default 1), `limit` (default 10, máx 50).

### Obtener tarea (`GET /api/v1/tasks/:id`)
- Solo el propietario puede leerla → 403 o 404 si no es suya.

### Actualizar tarea (`PATCH /api/v1/tasks/:id`)
- Solo el propietario puede actualizarla.
- Todos los campos son opcionales en el PATCH.
- No se puede cambiar el `userId`.

### Eliminar tarea (`DELETE /api/v1/tasks/:id`)
- Solo el propietario puede eliminarla → 404 si no es suya.
- Éxito → **200** con mensaje de confirmación.

---

## Códigos de error estándar

| Código           | HTTP | Descripción                         |
|------------------|------|-------------------------------------|
| `BAD_REQUEST`    | 400  | Validación fallida                  |
| `UNAUTHORIZED`   | 401  | Sin token o credenciales inválidas  |
| `NOT_FOUND`      | 404  | Recurso no encontrado               |
| `CONFLICT`       | 409  | Email ya registrado                 |
| `INTERNAL_ERROR` | 500  | Error inesperado del servidor       |

---

## Notificaciones (lógica frontend)

- Las notificaciones **no persisten en base de datos**.
- Se calculan en tiempo real comparando `dueDate` de las tareas con la fecha actual.
- Una tarea completada siempre aparece en la sección `completed`.
- Una tarea vencida (dueDate < hoy) y no completada aparece en `overdue`.
- Una tarea con dueDate = hoy y no completada aparece en `today`.
