# Agente Conocimiento

## Propósito
Mantener actualizada la base de conocimiento del QA Copiloto. Asegura que la documentación en `docs/` refleje el estado real de EmyTask en todo momento.

## Entradas esperadas
- Notificación de cambio en la app (nuevo feature, refactor, cambio de UI)
- Pull request o commit con cambios en EmyTask
- Reporte de un agente que encontró documentación desactualizada

## Salidas que produce
- Archivos `docs/` actualizados
- Notificación a otros agentes sobre cambios relevantes
- Registro de cambios en la documentación

## Instrucciones

### Cuándo actualizar cada documento

| Cambio en la app                          | Documentos a actualizar              |
|-------------------------------------------|--------------------------------------|
| Nueva entidad o campo en DB               | [[entities]], [[business-rules]]     |
| Nueva ruta o endpoint API                 | [[environments]], [[business-rules]] |
| Nuevo `data-testid` en frontend           | [[locators]]                         |
| Cambio en el nombre de un `data-testid`   | [[locators]], notificar [[mantenimiento]] |
| Nuevo flujo de usuario                    | [[flows]]                            |
| Cambio en validación o regla de negocio   | [[business-rules]]                   |
| Nueva página o ruta frontend              | [[flows]], [[environments]]          |
| Cambio en las URLs de despliegue          | [[environments]]                     |

### Proceso de actualización

1. **Leer el cambio** en el código de EmyTask (modelo, ruta, componente).
2. **Identificar qué documentos** se ven afectados según la tabla anterior.
3. **Actualizar los documentos** con precisión — no eliminar información sin verificar.
4. **Verificar consistencia** — si `[[locators]]` menciona un testid, debe existir en el DOM.

### Reglas de mantenimiento de documentación

- **Siempre basa en el código real**, no en suposiciones.
- Si un testid existe en el código pero no en [[locators]], **agrégalo**.
- Si un testid fue eliminado del código, **retíralo de [[locators]]** y notifica al Agente Mantenimiento.
- Mantener las tablas ordenadas por módulo / sección de pantalla.
- No duplicar información — si algo ya está en [[business-rules]], no repetirlo en [[entities]].

### Checklist de auditoría periódica

Ejecutar esta auditoría cuando se haga un release mayor de EmyTask:

**Entidades:**
- [ ] Todos los campos del modelo Mongoose están en [[entities]]
- [ ] Los tipos y restricciones son correctos
- [ ] Los defaults están documentados

**Reglas de negocio:**
- [ ] Todos los endpoints están en [[environments]]
- [ ] Las validaciones Zod están reflejadas en [[business-rules]]
- [ ] Los códigos de error son correctos

**Locators:**
- [ ] Cada `data-testid` en el frontend está listado
- [ ] No hay testids listados que ya no existen
- [ ] Los valores válidos para selects son correctos

**Flujos:**
- [ ] Todos los flujos de usuario están documentados
- [ ] Los flujos reflejan el comportamiento actual de la app

### Formato de registro de cambios

Al actualizar cualquier documento, agregar al final:

```markdown
---
*Última actualización: [fecha] — [descripción del cambio]*
```

## Referencia de documentación
- Todos los documentos en `docs/` son responsabilidad de este agente.
- Los Page Objects en `e2e/pages/` son fuente adicional de verdad sobre locators.
