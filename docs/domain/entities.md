# Entidades del dominio — EmyTask

## User

| Campo         | Tipo     | Requerido | Notas                         |
|---------------|----------|-----------|-------------------------------|
| `id`          | string   | sí        | ObjectId de MongoDB           |
| `name`        | string   | sí        | 2–50 caracteres               |
| `email`       | string   | sí        | único, lowercase, válido      |
| `passwordHash`| string   | sí        | bcrypt, nunca expuesto en API |
| `createdAt`   | Date     | sí        | auto                          |
| `updatedAt`   | Date     | sí        | auto                          |

La API **nunca** devuelve `passwordHash`. El token JWT contiene `userId`.

---

## Task

| Campo         | Tipo           | Requerido | Valores posibles / restricciones             |
|---------------|----------------|-----------|----------------------------------------------|
| `id`          | string         | sí        | ObjectId de MongoDB                          |
| `title`       | string         | sí        | 1–100 caracteres, trimmed                    |
| `description` | string         | no        | máx 500 caracteres, trimmed                  |
| `status`      | TaskStatus     | no        | `pending` · `in_progress` · `completed`      |
| `priority`    | TaskPriority   | no        | `low` · `medium` · `high`                    |
| `dueDate`     | Date           | no        | fecha de vencimiento                         |
| `userId`      | string         | sí        | referencia al User propietario               |
| `createdAt`   | Date           | sí        | auto                                         |
| `updatedAt`   | Date           | sí        | auto                                         |

**Defaults al crear:** `status = pending`, `priority = medium` (aplicados por el modelo Mongoose).

**Pertenencia:** una tarea pertenece exclusivamente a un usuario. Ningún otro usuario puede leerla, editarla ni eliminarla.

---

## Notificaciones (frontend)

Las notificaciones **no tienen entidad de backend propia**. Se calculan en el frontend a partir de las tareas del usuario:

| Sección     | Criterio                                             | `data-testid`         |
|-------------|------------------------------------------------------|-----------------------|
| `overdue`   | `dueDate < hoy` y `status !== 'completed'`           | `section-overdue`     |
| `today`     | `dueDate === hoy` y `status !== 'completed'`         | `section-today`       |
| `completed` | `status === 'completed'`                             | `section-completed`   |

---

## Respuestas de la API

```ts
// Éxito
{ success: true, data: T, message?: string, meta?: PaginationMeta }

// Error
{ success: false, error: { code: string, message: string, details?: unknown } }

// Paginación (en meta)
{ page: number, limit: number, total: number, totalPages: number }
```
