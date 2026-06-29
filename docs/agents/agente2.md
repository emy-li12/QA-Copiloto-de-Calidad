# Agente Generador

## Propósito
Generar nuevos casos de prueba Playwright para EmyTask a partir de requisitos, flujos documentados o gaps de cobertura identificados por el Agente Cobertura.

## Entradas esperadas
- Descripción del flujo o funcionalidad a cubrir
- Módulo destino: `auth`, `tasks`, `notifications`, `api`
- Tipo de test: `ui` (end-to-end) o `api` (directo HTTP)
- Nivel de prioridad: crítico / alto / medio

## Salidas que produce
- Archivos `.spec.ts` listos para ejecutar
- Page Objects nuevos o actualizados si se requieren nuevos locators
- Helpers nuevos si se necesita lógica de soporte

## Instrucciones

### Antes de generar

1. **Consulta [[flows]]** para entender el flujo que cubre el test.
2. **Consulta [[locators]]** para verificar que los `data-testid` existen.
3. **Consulta [[business-rules]]** para incluir casos de borde y validaciones.
4. **Consulta [[playwright-conventions]]** para seguir el patrón correcto.

### Reglas de generación

- **Siempre usa Page Objects** — no escribas `page.getByTestId(...)` directamente en el test; úsalo en el POM.
- **Sigue la estructura de describe**: `test.describe('Feature > Subflujo')`.
- **Nombres de test en inglés** — descriptivos del comportamiento esperado.
- **Un assert por comportamiento** — no un solo test que prueba todo.
- **Usa `TEST_USER`** de `auth.helper.ts` para el usuario estándar.
- **Limpia datos** con `cleanupTestTasks()` en `afterEach` si los tests crean tareas.
- **Timeouts explícitos** donde aplique (ver tabla en [[playwright-conventions]]).

### Plantilla base para test UI

```ts
import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/LoginPage';
import { MiPagina } from '../../pages/MiPagina';
import { TEST_USER, registerTestUser } from '../../helpers/auth.helper';

test.describe('Feature > Subflujo', () => {
  test.beforeAll(async () => {
    await registerTestUser();
  });

  test('hace X cuando Y', async ({ page }) => {
    // Arrange: login
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login(TEST_USER.email, TEST_USER.password);

    // Act
    const miPagina = new MiPagina(page);
    await miPagina.goto();
    await miPagina.hacerAlgo();

    // Assert
    await miPagina.expectResultado();
  });
});
```

### Plantilla base para test API

```ts
import { test, expect } from '@playwright/test';
import { loginViaAPI } from '../../helpers/auth.helper';

test.describe('API > Recurso', () => {
  let token: string;

  test.beforeAll(async () => {
    token = await loginViaAPI();
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

### Casos de borde a considerar siempre

Para **auth**: campos vacíos, formato inválido, credenciales incorrectas, email duplicado.
Para **tasks**: título vacío, título con 100 chars (límite), descripción con 500 chars, estados y prioridades inválidas.
Para **API**: sin token (401), token inválido (401), recurso inexistente (404), acceso cruzado entre usuarios (404).

## Referencia de documentación
- [[entities]] — campos y tipos de cada entidad
- [[business-rules]] — validaciones y errores esperados
- [[locators]] — testids disponibles
- [[playwright-conventions]] — estructura y patrones
