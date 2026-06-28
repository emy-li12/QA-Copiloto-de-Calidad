# Flujos de usuario — EmyTask

## Flujo de autenticación

```
[Usuario no autenticado]
  → Intenta acceder a ruta protegida (/dashboard, /tasks, /notifications)
  → Redirige automáticamente a /login

[/login]
  → Ingresa email + password → POST /api/v1/auth/login
  → Éxito: guarda token en localStorage, redirige a /dashboard
  → Error: muestra toast de error, permanece en /login

[/register]
  → Ingresa name + email + password + confirmPassword
  → Validación frontend: confirm debe coincidir con password
  → POST /api/v1/auth/register
  → Éxito: guarda token en localStorage, redirige a /dashboard
  → Error (409): muestra mensaje "email ya registrado"

[Logout]
  → Click en "Sign out" en sidebar
  → Limpia localStorage (token + user)
  → Redirige a /login
  → Intentar navegar a ruta protegida → redirige a /login
```

---

## Flujo de tareas (CRUD)

```
[/tasks]
  → Carga lista paginada del usuario autenticado
  → Si no hay tareas: muestra estado vacío (empty state)

[Crear tarea]
  → Click en botón "+" (task-create-btn)
  → Abre modal (task-form-modal)
  → Completa: title (req.), description, status, priority, dueDate
  → Submit: POST /api/v1/tasks
  → Éxito: modal se cierra, tarea aparece en la lista
  → Error (título vacío): muestra error de validación en el campo

[Editar tarea]
  → Click en botón de edición dentro de la tarjeta (task-edit-btn)
  → Abre modal con datos pre-cargados (task-form-modal)
  → Modifica campos → Submit: PATCH /api/v1/tasks/:id
  → Éxito: modal se cierra, tarjeta actualizada

[Eliminar tarea]
  → Click en botón de eliminar (task-delete-btn) dentro de la tarjeta
  → Abre modal de confirmación (delete-confirm-modal) con el nombre de la tarea
  → Click en "Confirmar" (delete-confirm-btn): DELETE /api/v1/tasks/:id
  → Éxito: modal desaparece, tarjeta eliminada de la lista
  → Click en "Cancelar": modal desaparece, tarea permanece

[Filtros]
  → Selector de status (task-filters-status): filtra por pending/in_progress/completed
  → Selector de priority (task-filters-priority): filtra por low/medium/high
  → Limpiar filtros: muestra todas las tareas del usuario
```

---

## Flujo de notificaciones

```
[/notifications]
  → Carga todas las tareas del usuario
  → Clasifica en tres secciones:
      • Vencidas (overdue): dueDate < hoy, no completadas
      • Hoy (today): dueDate === hoy, no completadas
      • Completadas (completed): status === 'completed'
  → Cada sección muestra badge con conteo
  → Si una sección no tiene tareas: muestra conteo 0
```

---

## Flujo de navegación (sidebar)

```
Sidebar visible en todas las rutas protegidas:
  - Dashboard   → /dashboard      (nav-dashboard)
  - Tareas      → /tasks          (nav-tasks)
  - Notificaciones → /notifications (nav-notifications)
  - Sign out    → logout
```

---

## Flujo del dashboard

```
[/dashboard]
  → Muestra saludo personalizado: "¡Hola, {nombre}!"
  → Stat cards: Total · Pendientes · En progreso · Completadas
  → Gráfico donut: "Distribución de tareas"
  → Datos calculados del total de tareas del usuario
```
