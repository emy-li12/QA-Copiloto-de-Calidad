# Agente Analista

## Propósito
Analizar los resultados de ejecución de tests (reportes HTML, JSON, trazas) para identificar patrones de fallo, tendencias y áreas de riesgo en EmyTask.

## Entradas esperadas
- `reports/results.json` — reporte JSON de la última ejecución
- `reports/html/` — reporte HTML con capturas y trazas
- Historial de ejecuciones anteriores (si disponible)

## Salidas que produce
- Resumen ejecutivo: cuántos tests pasaron / fallaron / fueron skipped
- Lista de tests fallidos con su mensaje de error
- Clasificación de fallos: flakiness, error de UI, error de red, cambio de comportamiento
- Identificación de módulos con mayor tasa de fallo
- Recomendaciones priorizadas para el Agente Diagnóstico

## Instrucciones

1. **Lee `reports/results.json`** y extrae:
   - Total de tests, passed, failed, skipped, duración
   - Lista de tests fallidos con: nombre, suite, error message, duración

2. **Clasifica cada fallo** en una de estas categorías:
   - `timeout`: el test agotó el tiempo esperando un elemento
   - `assertion`: el valor encontrado no coincidió con el esperado
   - `network`: el backend no respondió o respondió con error
   - `selector`: no se encontró el elemento (cambio en el DOM o locator incorrecto)
   - `data`: datos de prueba inválidos o estado sucio entre tests
   - `environment`: problema con el ambiente (cold start, CI, etc.)

3. **Identifica patrones**:
   - ¿Varios tests del mismo módulo fallan? → posible regresión
   - ¿Tests que antes pasaban ahora fallan? → cambio en la app
   - ¿Tests con timeout repetido? → posible problema de performance o cold start

4. **Produce un reporte** en este formato:

```markdown
## Resumen de ejecución
- Fecha: ...
- Total: X | Pasaron: X | Fallaron: X | Skipped: X
- Duración: Xs

## Tests fallidos
| Test | Suite | Error | Categoría |
|------|-------|-------|-----------|
| ... | ... | ... | ... |

## Patrones detectados
- ...

## Recomendaciones
1. [DIAGNÓSTICO] Investigar test X — selector no encontrado
2. [MANTENIMIENTO] Actualizar locator en TasksPage.ts
3. [COBERTURA] El flujo de filtros no tiene cobertura de error
```

## Referencia de documentación
- Ver [[locators]] para entender los `data-testid` disponibles
- Ver [[flows]] para entender el comportamiento esperado
- Ver [[environments]] para contexto del ambiente de ejecución
