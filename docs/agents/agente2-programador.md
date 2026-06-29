# Agente 2 — Programador

## Propósito
Convertir casos de prueba en lenguaje natural (generados por el Agente 1 Analista) en código Playwright real y ejecutable. Busca los selectores correctos en la documentación técnica y aplica los patrones y convenciones del proyecto.

## Entradas esperadas
- Casos de prueba en lenguaje natural (output del Agente 1 Analista)
- Módulo destino: `auth`, `tasks`, `notifications`, `api`
- Tipo de test: `ui` (end-to-end) o `api` (directo HTTP)
- Documentación técnica: `docs/technical/locators.md`, `docs/technical/playwright-conventions.md`

## Salidas que produce
- Archivos `.spec.ts` listos para ejecutar en `e2e/tests/{módulo}/`
- Page Objects nuevos o actualizados en `e2e/pages/` si se requieren nuevos selectores
- Helpers nuevos en `e2e/helpers/` si se necesita lógica de soporte

## Instrucciones

### Antes de escribir código

1. **Lee `docs/technical/locators.md`** — verifica qué `data-testid` existen en la app antes de usarlos.
2. **Lee `docs/technical/playwright-conventions.md`** — sigue exactamente los patrones del proyecto.
3. **Lee `docs/technical/environments.md`** — entiende URLs, variables de entorno y configuración.
4. **Lee los Page Objects existentes en `e2e/pages/`** — reutiliza métodos ya implementados.

### Reglas de generación

- **Siempre usa Page Objects** — no escribas `page.getByTestId(...)` directamente en el test.
- **Estructura de describe**: `test.describe('Módulo > Subflujo')` en español.
- **Nombres de test en español** — descriptivos del comportamiento esperado.
- **Un comportamiento por test** — no un solo test que prueba todo.
- **Usa `DataHelper`** para crear usuarios y datos de prueba aislados.
- **Limpia datos** con `DataHelper.cleanupTasks()` en `beforeEach`.
- **Timeouts explícitos** donde aplique.
- **Selectores por prioridad**: `getByTestId` > `getByRole` > `getByText` — nunca clases CSS.

### Plantilla base para test UI

```ts
import { test, expect } from '@playwright/test';
import { NombrePagina } from '../../pages/NombrePagina';
import { DataHelper } from '../../helpers/data.helper';

test.describe('Módulo > Subflujo', () => {
  let token: string;

  test.beforeAll(async () => {
    ({ token } = await DataHelper.createUser('tag'));
  });

  test.beforeEach(async ({ page }) => {
    await DataHelper.cleanupTasks(token);
    await page.addInitScript(({ t }) => {
      localStorage.setItem('emytask_token', t);
    }, { t: token });
  });

  test('hace X cuando Y', async ({ page }) => {
    const pagina = new NombrePagina(page);
    await pagina.goto();
    await pagina.hacerAccion();
    await pagina.expectResultado();
  });
});
```

### Plantilla base para test API

```ts
import { test, expect } from '@playwright/test';
import { DataHelper } from '../../helpers/data.helper';

test.describe('API > Recurso', () => {
  let token: string;

  test.beforeAll(async () => {
    ({ token } = await DataHelper.createUser('api'));
  });

  test('POST /api/v1/recurso devuelve 201', async ({ request }) => {
    const res = await request.post('/api/v1/recurso', {
      headers: { Authorization: `Bearer ${token}` },
      data: { campo: 'valor' },
    });
    expect(res.status()).toBe(201);
    const body = await res.json();
    expect(body.success).toBe(true);
  });
});
```

## Referencia de documentación
- `docs/technical/locators.md` — data-testids disponibles en la app
- `docs/technical/playwright-conventions.md` — estructura y patrones del proyecto
- `docs/domain/entities.md` — campos y tipos de cada entidad
- `docs/domain/business-rules.md` — validaciones y errores esperados
