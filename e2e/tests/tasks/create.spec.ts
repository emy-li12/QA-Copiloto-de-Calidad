import { test, expect } from '@playwright/test';
import { TasksPage } from '../../pages/TasksPage';
import { TaskFactory } from '../../data/task.factory';
import { registerTestUser, loginViaAPI, setAuthInBrowser, cleanupTestTasks } from '../../helpers/auth.helper';

test.describe('Tasks > Crear tarea', () => {
  let token: string;

  test.beforeAll(async () => {
    await registerTestUser();
  });

  test.beforeEach(async ({ page }) => {
    token = await loginViaAPI();
    await cleanupTestTasks(token);
    await setAuthInBrowser(page, token);
  });

  test('abre el modal con todos los campos del formulario', async ({ page }) => {
    const tasksPage = new TasksPage(page);
    await tasksPage.goto();
    await tasksPage.openCreateModal();

    await expect(page.getByTestId('task-title-input')).toBeVisible();
    await expect(page.getByTestId('task-description-input')).toBeVisible();
    await expect(page.getByTestId('task-status-select')).toBeVisible();
    await expect(page.getByTestId('task-priority-select')).toBeVisible();
    await expect(page.getByTestId('task-due-date-input')).toBeVisible();
  });

  test('muestra error de validación cuando el título está vacío', async ({ page }) => {
    const tasksPage = new TasksPage(page);
    await tasksPage.goto();
    await tasksPage.openCreateModal();
    await page.getByTestId('task-submit-btn').click();

    await expect(
      page.locator('text=requerido').or(page.locator('text=required'))
    ).toBeVisible({ timeout: 3000 });
    await expect(page.getByTestId('task-form-modal')).toBeVisible();
  });

  test('crea tarea solo con título', async ({ page }) => {
    const task = TaskFactory.minimal();
    const tasksPage = new TasksPage(page);
    await tasksPage.goto();
    await tasksPage.createTask({ title: task.title });
    await tasksPage.expectTaskCard(task.title);
  });

  test('crea tarea con todos los campos', async ({ page }) => {
    const task = TaskFactory.inProgress();
    const tasksPage = new TasksPage(page);
    await tasksPage.goto();
    await tasksPage.createTask({
      title: task.title,
      description: 'Descripción completa de QA',
      status: 'in_progress',
      priority: 'high',
    });

    await tasksPage.expectTaskCard(task.title);
    const card = tasksPage.getCard(task.title);
    await expect(card.getByText('En progreso', { exact: true })).toBeVisible();
    await expect(card.locator('text=Alta')).toBeVisible();
  });

  test('cancela el modal sin crear la tarea', async ({ page }) => {
    const title = `cancelar-${Date.now()}`;
    const tasksPage = new TasksPage(page);
    await tasksPage.goto();
    await tasksPage.openCreateModal();
    await page.getByTestId('task-title-input').fill(title);
    await page.locator('text=Cancelar').click();

    await expect(page.getByTestId('task-form-modal')).not.toBeVisible();
    await tasksPage.expectNoTaskCard(title);
  });

  test('muestra estado vacío cuando no hay tareas', async ({ page }) => {
    const tasksPage = new TasksPage(page);
    await tasksPage.goto();
    await tasksPage.expectEmptyState();
  });
});
