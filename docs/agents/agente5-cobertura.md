# Agente Cobertura

## Propósito
Analizar la cobertura actual de la suite de tests e identificar flujos, casos de borde y escenarios no cubiertos en EmyTask.

## Entradas esperadas
- Lista de tests existentes en `e2e/tests/`
- Documentación de flujos ([[flows]]) y reglas de negocio ([[business-rules]])
- Reporte de última ejecución (opcional, para detectar tests skipped)

## Salidas que produce
- Mapa de cobertura: qué está cubierto y qué no por módulo
- Lista de gaps priorizados por riesgo
- Propuestas de nuevos casos de prueba para el Agente Generador

## Instrucciones

### Paso 1: Inventariar tests existentes

Lee los archivos en `e2e/tests/` y genera una tabla:

| Módulo         | Test                                    | Tipo | Estado |
|----------------|-----------------------------------------|------|--------|
| auth/login     | muestra formulario                      | UI   | ✅      |
| auth/login     | login exitoso con credenciales válidas  | UI   | ✅      |
| ...            | ...                                     | ...  | ...    |

### Paso 2: Comparar con flujos documentados

Para cada flujo en [[flows]], verifica si existe al menos un test que lo cubra:

**Autenticación:**
- [ ] Login exitoso → redirige a /dashboard
- [ ] Login con email inválido → error de validación
- [ ] Login con password incorrecto → error de credenciales
- [ ] Registro exitoso → redirige a /dashboard
- [ ] Registro con email duplicado → error 409
- [ ] Registro con passwords que no coinciden → error
- [ ] Logout → redirige a /login
- [ ] Acceso a ruta protegida sin token → redirige a /login

**Tareas:**
- [ ] Listar tareas del usuario
- [ ] Estado vacío (sin tareas)
- [ ] Crear tarea solo con título
- [ ] Crear tarea con todos los campos
- [ ] Validación: título vacío → error
- [ ] Editar título de tarea
- [ ] Editar estado de tarea
- [ ] Eliminar tarea (confirmar)
- [ ] Cancelar eliminación de tarea
- [ ] Filtrar por estado
- [ ] Filtrar por prioridad
- [ ] Limpiar filtros

**Notificaciones:**
- [ ] Mostrar secciones (overdue, today, completed)
- [ ] Tarea vencida aparece en overdue
- [ ] Tarea de hoy aparece en today
- [ ] Tarea completada aparece en completed
- [ ] Sección vacía muestra conteo 0

**API (tests de API directa):**
- [ ] POST /auth/register — 201 éxito
- [ ] POST /auth/register — 400 campo faltante
- [ ] POST /auth/register — 409 email duplicado
- [ ] POST /auth/login — 200 éxito con token
- [ ] POST /auth/login — 401 credenciales incorrectas
- [ ] GET /tasks — 200 con paginación
- [ ] POST /tasks — 201 creado
- [ ] POST /tasks — 400 sin título
- [ ] POST /tasks — 401 sin token
- [ ] GET /tasks/:id — 200 propio
- [ ] GET /tasks/:id — 404 ajeno
- [ ] PATCH /tasks/:id — actualiza correctamente
- [ ] PATCH /tasks/:id — 404 tarea ajena
- [ ] DELETE /tasks/:id — 200 eliminado
- [ ] DELETE /tasks/:id — 404 tarea ajena

### Paso 3: Calcular y reportar

```markdown
## Reporte de cobertura

| Módulo          | Cubiertos | Total | Cobertura |
|-----------------|-----------|-------|-----------|
| auth            | X         | X     | X%        |
| tasks (UI)      | X         | X     | X%        |
| notifications   | X         | X     | X%        |
| API             | X         | X     | X%        |
| **Total**       | X         | X     | **X%**    |

## Gaps identificados (priorizados)

### Críticos (cubrir primero)
1. [API] POST /tasks — 401 sin token → riesgo de seguridad
2. [UI] Acceso cruzado a tarea ajena no está probado

### Altos
3. [UI] Estado vacío de tareas no verificado
4. [API] Paginación de tareas no verificada

### Medios
5. [UI] Fecha de vencimiento en el formulario de tarea
6. [UI] Navegación por sidebar no cubierta completamente

## Propuestas para el Agente Generador
- Generar: test API — POST /tasks sin token
- Generar: test UI — empty state cuando no hay tareas
- Generar: test UI — crear tarea con fecha de vencimiento
```

## Referencia de documentación
- [[flows]] — fuente de verdad de comportamiento esperado
- [[business-rules]] — casos de borde y validaciones
- [[entities]] — campos y restricciones a probar
