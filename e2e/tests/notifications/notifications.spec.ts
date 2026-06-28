import { test, expect } from '@playwright/test';
import { NotificationsPage } from '../../pages/NotificationsPage';
import { DashboardPage } from '../../pages/DashboardPage';
import { LoginPage } from '../../pages/LoginPage';
import { TaskFactory } from '../../data/task.factory';
import {
  TEST_USER,
  registerTestUser,
  loginViaAPI,
  setAuthInBrowser,
  cleanupTestTasks,
  createTaskViaAPI,
} from '../../helpers/auth.helper';

test.describe('Notifications', () => {
  let token: string;

  test.beforeAll(async () => {
    await registerTestUser();
  });

  test.beforeEach(async ({ page }) => {
    token = await loginViaAPI();
    await cleanupTestTasks(token);
    await setAuthInBrowser(page, token);
  });

  test('es accesible desde el sidebar', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login(TEST_USER.email, TEST_USER.password);

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

  test('tarea completada aparece en la sección completed', async ({ page }) => {
    const task = TaskFactory.completed();
    await createTaskViaAPI(token, task);

    const notifPage = new NotificationsPage(page);
    await notifPage.goto();
    await notifPage.expectSectionHasTasks('completed');
    await notifPage.expectTaskInSection('completed', task.title);
  });

  test('tarea vencida aparece en la sección overdue', async ({ page }) => {
    const task = TaskFactory.overdue();
    await createTaskViaAPI(token, task);

    const notifPage = new NotificationsPage(page);
    await notifPage.goto();
    await notifPage.expectSectionHasTasks('overdue');
    await notifPage.expectTaskInSection('overdue', task.title);
  });

  test('tarea con dueDate hoy aparece en sección today', async ({ page }) => {
    const task = TaskFactory.dueToday();
    await createTaskViaAPI(token, task);

    const notifPage = new NotificationsPage(page);
    await notifPage.goto();
    await notifPage.expectSectionHasTasks('today');
    await notifPage.expectTaskInSection('today', task.title);
  });
});
