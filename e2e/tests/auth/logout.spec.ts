import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/LoginPage';
import { TEST_USER, registerTestUser } from '../../helpers/auth.helper';

test.describe('Auth > Logout', () => {
  test.beforeAll(async () => {
    await registerTestUser();
  });

  test('logout redirige a /login', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login(TEST_USER.email, TEST_USER.password);
    await expect(page).toHaveURL(/\/dashboard/, { timeout: 8000 });

    await page.locator('text=Sign out').click();
    await expect(page).toHaveURL(/\/login/, { timeout: 5000 });
  });

  test('no puede acceder a ruta protegida tras logout', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login(TEST_USER.email, TEST_USER.password);
    await expect(page).toHaveURL(/\/dashboard/, { timeout: 8000 });

    await page.locator('text=Sign out').click();
    await page.goto('/tasks');
    await expect(page).toHaveURL(/\/login/, { timeout: 5000 });
  });
});
