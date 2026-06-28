import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/LoginPage';
import { TEST_USER, registerTestUser } from '../../helpers/auth.helper';

test.describe('Auth > Login', () => {
  test.beforeAll(async () => {
    await registerTestUser();
  });

  test('muestra el formulario de login', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.expectFormVisible();
  });

  test('redirige a /login al acceder a ruta protegida sin token', async ({ page }) => {
    await page.goto('/dashboard');
    await expect(page).toHaveURL(/\/login/, { timeout: 5000 });
  });

  test('redirige a /login al acceder a /tasks sin token', async ({ page }) => {
    await page.goto('/tasks');
    await expect(page).toHaveURL(/\/login/, { timeout: 5000 });
  });

  test('login exitoso redirige al dashboard', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login(TEST_USER.email, TEST_USER.password);
    await loginPage.expectRedirectedToDashboard();
  });

  test('password incorrecto permanece en /login', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login(TEST_USER.email, 'wrongpassword');
    await loginPage.expectStaysOnLogin();
  });

  test('email vacío muestra error de validación', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.passwordInput.fill('somepassword');
    await loginPage.submitBtn.click();
    await expect(page.locator('text=Enter a valid email address')).toBeVisible({ timeout: 3000 });
  });

  test('link "Crear cuenta" navega a /register', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.goToRegisterLink.click();
    await expect(page).toHaveURL(/\/register/);
  });
});
