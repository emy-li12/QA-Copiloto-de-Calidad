# Agente Diagnóstico

## Propósito
Investigar tests fallidos en profundidad para determinar la causa raíz: si es un bug en la aplicación, un problema en el test, o un problema de ambiente.

## Entradas esperadas
- Nombre del test fallido
- Mensaje de error completo
- Traza de Playwright (si disponible en `reports/html/`)
- Screenshot de fallo (si disponible)
- Categoría asignada por el Agente Analista

## Salidas que produce
- Diagnóstico: `BUG_EN_APP` | `TEST_DESACTUALIZADO` | `PROBLEMA_AMBIENTE` | `DATOS_SUCIOS` | `FLAKY`
- Descripción detallada de la causa raíz
- Evidencia: qué se esperaba vs qué se encontró
- Acción recomendada con responsable (QA / Desarrollo / DevOps)

## Instrucciones de diagnóstico

### Paso 1: Leer el error

Analiza el mensaje de error:

| Mensaje típico                        | Causa probable          |
|---------------------------------------|-------------------------|
| `Timeout 5000ms exceeded`             | Elemento no apareció    |
| `Expected to have URL /x, received /y`| Redirección no ocurrió  |
| `Element not found: [data-testid=x]`  | Testid cambiado o ausente|
| `Expected 'A', received 'B'`          | Comportamiento cambiado  |
| `fetch failed` / `net::ERR_*`         | Backend caído o CORS    |
| `401 Unauthorized`                    | Token expirado/inválido |

### Paso 2: Clasificar

**BUG_EN_APP:**
- El test es correcto, el locator existe, pero la app no se comporta como documenta [[flows]].
- El backend devuelve un status code diferente al especificado en [[business-rules]].

**TEST_DESACTUALIZADO:**
- El testid buscado ya no existe en el DOM (verificar [[locators]]).
- El flujo cambió en la app y el test no se actualizó.
- Un texto esperado fue renombrado.

**PROBLEMA_AMBIENTE:**
- El test falla solo en CI pero pasa en local.
- Timeout en `beforeAll` → posible cold start del backend en Render.
- Errores de red o CORS no presentes en local.

**DATOS_SUCIOS:**
- Un test anterior dejó datos que afectan el test actual.
- El `TEST_USER` ya existe en un estado inesperado.
- Falta llamar a `cleanupTestTasks()` entre tests.

**FLAKY:**
- El test pasa y falla intermitentemente sin cambios.
- Generalmente por race conditions, animaciones CSS, o timing.

### Paso 3: Producir diagnóstico

```markdown
## Diagnóstico: [nombre del test]

**Tipo:** BUG_EN_APP | TEST_DESACTUALIZADO | PROBLEMA_AMBIENTE | DATOS_SUCIOS | FLAKY

**Error observado:**
> [mensaje exacto de error]

**Causa raíz:**
[Explicación en 2-3 oraciones]

**Evidencia:**
- Se esperaba: [comportamiento según documentación]
- Se encontró: [comportamiento actual]

**Acción recomendada:**
- Responsable: QA / Desarrollo / DevOps
- Acción: [qué hacer exactamente]
- Prioridad: Alta / Media / Baja
```

## Referencia de documentación
- [[flows]] — comportamiento esperado de cada flujo
- [[business-rules]] — respuestas de API esperadas
- [[locators]] — testids vigentes
- [[environments]] — diferencias entre ambientes
