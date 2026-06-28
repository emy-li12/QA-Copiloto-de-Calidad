# Locators conocidos — EmyTask

Todos los `data-testid` registrados en la aplicación. Usar `page.getByTestId('id')` en los Page Objects.

---

## Login (`/login`)

| `data-testid`            | Elemento              | Notas                              |
|--------------------------|-----------------------|------------------------------------|
| `login-email-input`      | Input email           |                                    |
| `login-password-input`   | Input password        |                                    |
| `login-submit-btn`       | Botón "Iniciar sesión"|                                    |
| `go-to-register-link`    | Link "Crear cuenta"   | Navega a /register                 |

---

## Register (`/register`)

| `data-testid`                      | Elemento               | Notas                |
|------------------------------------|------------------------|----------------------|
| `register-name-input`              | Input nombre           |                      |
| `register-email-input`             | Input email            |                      |
| `register-password-input`          | Input password         |                      |
| `register-confirm-password-input`  | Input confirmar pwd    |                      |
| `register-submit-btn`              | Botón "Registrarse"    |                      |
| `go-to-login-link`                 | Link "Ya tengo cuenta" | Navega a /login      |

---

## Navegación / Sidebar

| `data-testid`           | Elemento                  | Ruta destino      |
|-------------------------|---------------------------|-------------------|
| `nav-dashboard`         | Link Dashboard (sidebar)  | `/dashboard`      |
| `nav-tasks`             | Link Tareas (sidebar)     | `/tasks`          |
| `nav-notifications`     | Link Notificaciones       | `/notifications`  |

---

## Dashboard (`/dashboard`)

Usa texto visible para las verificaciones (no data-testid en los stat cards):

| Selector                  | Descripción                          |
|---------------------------|--------------------------------------|
| `getByText('¡Hola,')`     | Saludo personalizado al usuario      |
| `getByText('Total')`      | Stat card Total de tareas            |
| `getByText('Pendientes')` | Stat card tareas pendientes          |
| `getByText('En progreso')`| Stat card tareas en progreso         |
| `getByText('Completadas')`| Stat card tareas completadas         |
| `getByText('Distribución de tareas')` | Título del gráfico donut |

---

## Tareas (`/tasks`)

| `data-testid`              | Elemento                        | Notas                             |
|----------------------------|---------------------------------|-----------------------------------|
| `tasks-page`               | Contenedor principal de la página | Usado para `goto()` wait         |
| `task-create-btn`          | Botón crear tarea "+"           |                                   |
| `task-filters-status`      | Select filtro por estado        | Opciones: pending, in_progress, completed |
| `task-filters-priority`    | Select filtro por prioridad     | Opciones: low, medium, high       |
| `task-card`                | Tarjeta de tarea (múltiples)    | Filtrar con `.filter({ hasText })` |
| `task-edit-btn`            | Botón editar dentro de task-card|                                   |
| `task-delete-btn`          | Botón eliminar dentro de task-card |                                |
| `task-form-modal`          | Modal crear/editar tarea        | Visible al abrir                  |
| `task-title-input`         | Input título en el modal        |                                   |
| `task-description-input`   | Textarea descripción en modal   |                                   |
| `task-status-select`       | Select estado en modal          |                                   |
| `task-priority-select`     | Select prioridad en modal       |                                   |
| `task-submit-btn`          | Botón submit en modal           |                                   |
| `delete-confirm-modal`     | Modal de confirmación de borrado|                                   |
| `delete-confirm-btn`       | Botón confirmar borrado         |                                   |

---

## Notificaciones (`/notifications`)

| `data-testid`           | Elemento                          | Notas                                     |
|-------------------------|-----------------------------------|-------------------------------------------|
| `notifications-page`    | Contenedor principal              | Usado para `goto()` wait                  |
| `section-overdue`       | Sección tareas vencidas           | Badge con conteo en `span:last-child`     |
| `section-today`         | Sección tareas de hoy             | Badge con conteo en `span:last-child`     |
| `section-completed`     | Sección tareas completadas        | Badge con conteo en `span:last-child`     |

---

## Patrones de locator compuesto

```ts
// Tarjeta de tarea específica
page.getByTestId('task-card').filter({ hasText: 'Mi tarea' })

// Botón dentro de una tarjeta específica
page.getByTestId('task-card').filter({ hasText: 'Mi tarea' }).getByTestId('task-edit-btn')

// Badge de conteo en sección de notificaciones
page.getByTestId('section-overdue').locator('span').last()

// Toast de error (React Hot Toast)
page.locator('[role="status"]').or(page.locator('.react-hot-toast'))
```

---

## Valores válidos para selects

```ts
// task-status-select
'pending' | 'in_progress' | 'completed'

// task-filters-status
'pending' | 'in_progress' | 'completed'

// task-priority-select
'low' | 'medium' | 'high'

// task-filters-priority
'low' | 'medium' | 'high'
```
