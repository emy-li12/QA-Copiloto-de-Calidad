# Convenciones de Playwright — QA Copiloto

## Versión y configuración

- **Playwright:** `^1.52.0`
- **Config:** `playwright.config.ts` en la raíz del proyecto
- **testDir:** `./e2e/tests`
- **Browser:** Chromium (Desktop Chrome)
- **parallelismo:** desactivado (`fullyParallel: false`, `workers: 1` en local)
- **retries:** 0 en local, 2 en CI

---

## Estructura de archivos

```
e2e/
├── pages/           # Page Objects — una clase por página
├── helpers/         # Funciones utilitarias (auth, API calls)
├── fixtures/        # Fixtures tipados con estado compartido
├── data/            # Factories de datos de prueba
└── tests/
    ├── auth/        # Tests de autenticación (login, registro, logout)
    ├── tasks/       # Tests de tareas (CRUD, filtros)
    ├── notifications/  # Tests de notificaciones
    └── api/         # Tests de API directa (sin UI)
```

---

## Page Object Model (POM)

Cada página tiene su clase en `e2e/pages/`. Reglas:

1. El constructor recibe `page: Page` y define los `Locator` como propiedades `readonly`.
2. Locators usando `getByTestId()` como estrategia primaria.
3. Métodos de acción: `goto()`, `fill*()`, `click*()`, `submit*()`.
4. Métodos de aserción: `expect*()` — usan `expect(locator).toBeVisible()` internamente.
5. No usar `page.locator('css selector')` salvo que `getByTestId` no sea suficiente.

### Ejemplo de estructura

```ts
export class MiPagina {
  readonly page: Page;
  readonly input: Locator;

  constructor(page: Page) {
    this.page = page;
    this.input = page.getByTestId('mi-input');
  }

  async goto() { await this.page.goto('/ruta'); }
  async fillInput(value: string) { await this.input.fill(value); }
  async expectVisible() { await expect(this.input).toBeVisible(); }
}
```

---

## Estrategia de locators (orden de preferencia)

1. `page.getByTestId('data-testid')` — **preferida siempre**
2. `page.getByRole('button', { name: 'texto' })` — para elementos sin testid
3. `page.getByText('texto exacto')` — para texto visible estático
4. `page.locator('.clase')` — **solo como último recurso**

---

## Gestión de autenticación en tests

### Para tests que requieren login (UI):
```ts
const loginPage = new LoginPage(page);
await loginPage.goto();
await loginPage.login(TEST_USER.email, TEST_USER.password);
await expect(page).toHaveURL(/\/dashboard/, { timeout: 8000 });
```

### Para tests que necesitan token (API):
```ts
import { loginViaAPI, setAuthInBrowser } from '../helpers/auth.helper';
const token = await loginViaAPI();
await setAuthInBrowser(page, token);
// Navegar a la página — ya autenticado
```

### Usuario de prueba estándar:
```ts
export const TEST_USER = {
  name: 'E2E Test User',
  email: 'e2e@emytask.test',
  password: 'TestPassword123',
};
```
El usuario se crea antes de la suite con `test.beforeAll(() => registerTestUser())`. El status 409 (ya existe) es ignorado.

---

## Timeouts estándar

| Escenario                        | Timeout  |
|----------------------------------|----------|
| Navegación / redirección         | 8000 ms  |
| Elementos visibles post-acción   | 5000 ms  |
| Validaciones de error rápidas    | 3000 ms  |
| Default Playwright               | 30000 ms |

---

## Convenciones de `test.describe`

```ts
test.describe('Feature', () => {
  test.describe('Subflujo', () => {
    test('hace algo concreto', async ({ page }) => { ... });
  });
});
```

- Los nombres de test deben describir el comportamiento esperado en tercera persona.
- Usar `test.beforeAll` para setup costoso (crear usuario, obtener token).
- Usar `test.beforeEach` para acciones que se repiten en cada test (login).

---

## Tests de API (sin UI)

Los tests en `tests/api/` usan `request` de Playwright para hacer HTTP directo:

```ts
import { test, expect } from '@playwright/test';

test('POST /api/v1/auth/login devuelve token', async ({ request }) => {
  const res = await request.post('/api/v1/auth/login', {
    data: { email: '...', password: '...' },
  });
  expect(res.status()).toBe(200);
  const body = await res.json();
  expect(body.success).toBe(true);
  expect(body.data.token).toBeTruthy();
});
```

---

## Reportes

- **HTML report:** `reports/html/` — `npx playwright show-report reports/html`
- **JSON:** `reports/results.json`
- **Screenshots:** solo en fallo
- **Video:** retenido en fallo
- **Trace:** en primer retry
