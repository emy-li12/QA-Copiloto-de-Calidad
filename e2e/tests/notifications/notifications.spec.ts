import { test, expect } from '@playwright/test';
import { NotificationsPage } from '../../pages/NotificationsPage';
import { DashboardPage } from '../../pages/DashboardPage';
import { LoginPage } from '../../pages/LoginPage';
import { DataHelper } from '../../helpers/data.helper';
import type { UserData } from '../../data';

test.describe('Notifications', () => {
  let token: string;
  let user: UserData;

  test.beforeAll(async () => {
    ({ user, token } = await DataHelper.createUser('notif'));
  });

  test.beforeEach(async ({ page }) => {
    await DataHelper.cleanupTasks(token);
    await page.addInitScript(
      ({ t, u }) => {
        localStorage.setItem('emytask_token', t);
        localStorage.setItem('emytask_user', JSON.stringify(u));
      },
      { t: token, u: { name: user.name, email: user.email, id: 'test' } }
    );
  });

  test('es accesible desde el sidebar', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login(user.email, user.password);

    const dashboardPage = new DashboardPage(page);
    await dashboardPage.navigateToNotifications();
    await expect(page.getByTestId('notifications-page')).toBeVisible();
  });

  test('muestra las tres secciones', async ({ page }) => {
    const notifPage = new NotificationsPage(page);
    await notifPage.goto();
    await notifPage.expectAllSectionsVisible();
  });

  test('muestra el título de la página', async ({ page }) => {
    const notifPage = new NotificationsPage(page);
    await notifPage.goto();
    await notifPage.expectPageTitle();
  });

  test('todas las secciones en cero sin tareas', async ({ page }) => {
    const notifPage = new NotificationsPage(page);
    await notifPage.goto();
    await notifPage.expectEmptySection('overdue');
    await notifPage.expectEmptySection('today');
    await notifPage.expectEmptySection('completed');
  });
});
