import { test, expect } from '@playwright/test';
import { TasksPage } from '../../pages/TasksPage';
import { registerTestUser, loginViaAPI, setAuthInBrowser, cleanupTestTasks, createTaskViaAPI } from '../../helpers/auth.helper';

test.describe('Tasks > Filtros', () => {
  let token: string;

  test.beforeAll(async () => {
    await registerTestUser();
  });

  test.beforeEach(async ({ page }) => {
    token = await loginViaAPI();
    await cleanupTestTasks(token);

    await Promise.all([
      createTaskViaAPI(token, { title: 'Tarea pendiente filtro', status: 'pending', priority: 'low' }),
      createTaskViaAPI(token, { title: 'Tarea completada filtro', status: 'completed', priority: 'high' }),
      createTaskViaAPI(token, { title: 'Tarea en progreso filtro', status: 'in_progress', priority: 'medium' }),
    ]);

    await setAuthInBrowser(page, token);
  });

  test('filtra tareas por estado pending', async ({ page }) => {
    const tasksPage = new TasksPage(page);
    await tasksPage.goto();
    await tasksPage.filterByStatus('pending');

    await tasksPage.expectTaskCard('Tarea pendiente filtro');
    await tasksPage.expectNoTaskCard('Tarea completada filtro');
    await tasksPage.expectNoTaskCard('Tarea en progreso filtro');
  });

  test('filtra tareas por estado completed', async ({ page }) => {
    const tasksPage = new TasksPage(page);
    await tasksPage.goto();
    await tasksPage.filterByStatus('completed');

    await tasksPage.expectTaskCard('Tarea completada filtro');
    await tasksPage.expectNoTaskCard('Tarea pendiente filtro');
  });

  test('filtra tareas por prioridad high', async ({ page }) => {
    const tasksPage = new TasksPage(page);
    await tasksPage.goto();
    await tasksPage.filterByPriority('high');

    await tasksPage.expectTaskCard('Tarea completada filtro');
    await tasksPage.expectNoTaskCard('Tarea pendiente filtro');
  });

  test('limpiar filtros muestra todas las tareas', async ({ page }) => {
    const tasksPage = new TasksPage(page);
    await tasksPage.goto();
    await tasksPage.filterByStatus('pending');
    await tasksPage.clearFilters();

    await tasksPage.expectTaskCard('Tarea pendiente filtro');
    await tasksPage.expectTaskCard('Tarea completada filtro');
    await tasksPage.expectTaskCard('Tarea en progreso filtro');
  });
});
