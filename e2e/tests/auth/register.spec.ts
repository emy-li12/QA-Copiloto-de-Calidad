import { test, expect } from '@playwright/test';
import { RegisterPage } from '../../pages/RegisterPage';

test.describe('Auth > Register', () => {
  test('muestra el formulario de registro', async ({ page }) => {
    const registerPage = new RegisterPage(page);
    await registerPage.goto();
    await registerPage.expectFormVisible();
  });

  test('registro exitoso redirige al dashboard', async ({ page }) => {
    const unique = `qa-reg-${Date.now()}@emytask.test`;
    const registerPage = new RegisterPage(page);
    await registerPage.goto();
    await registerPage.register('QA New User', unique, 'SecurePass123');
    await registerPage.expectRedirectedToDashboard();
  });

  test('passwords distintos muestran error de validación', async ({ page }) => {
    const registerPage = new RegisterPage(page);
    await registerPage.goto();
    await registerPage.register(
      'Test User',
      `mismatch-${Date.now()}@emytask.test`,
      'Password123',
      'Different123'
    );
    await registerPage.expectValidationError(/match|coinc/i);
  });

  test('link "Ya tengo cuenta" navega a /login', async ({ page }) => {
    const registerPage = new RegisterPage(page);
    await registerPage.goto();
    await registerPage.goToLoginLink.click();
    await expect(page).toHaveURL(/\/login/);
  });
});
