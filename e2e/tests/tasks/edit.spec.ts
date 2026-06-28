import { test, expect } from '@playwright/test';
import { TasksPage } from '../../pages/TasksPage';
import { TaskFactory } from '../../data/task.factory';
import { registerTestUser, loginViaAPI, setAuthInBrowser, cleanupTestTasks } from '../../helpers/auth.helper';

test.describe('Tasks > Editar tarea', () => {
  let token: string;

  test.beforeAll(async () => {
    await registerTestUser();
  });

  test.beforeEach(async ({ page }) => {
    token = await loginViaAPI();
    await cleanupTestTasks(token);
    await setAuthInBrowser(page, token);
  });

  test('abre el modal de edición con los datos pre-cargados', async ({ page }) => {
    const task = TaskFactory.minimal({ title: 'Tarea para editar' });
    const tasksPage = new TasksPage(page);
    await tasksPage.goto();
    await tasksPage.createTask({ title: task.title });
    await tasksPage.editTask(task.title);

    await expect(page.getByTestId('task-title-input')).toHaveValue(task.title);
  });

  test('actualiza el título de la tarea', async ({ page }) => {
    const original = TaskFactory.minimal({ title: 'Título original E2E' });
    const tasksPage = new TasksPage(page);
    await tasksPage.goto();
    await tasksPage.createTask({ title: original.title });
    await tasksPage.editTask(original.title);

    await page.getByTestId('task-title-input').clear();
    await page.getByTestId('task-title-input').fill('Título actualizado E2E');
    await page.getByTestId('task-submit-btn').click();
    await expect(page.getByTestId('task-form-modal')).not.toBeVisible({ timeout: 5000 });

    await tasksPage.expectTaskCard('Título actualizado E2E');
    await tasksPage.expectNoTaskCard(original.title);
  });

  test('actualiza el estado de la tarea a completada', async ({ page }) => {
    const task = TaskFactory.minimal({ title: 'Cambiar a completada' });
    const tasksPage = new TasksPage(page);
    await tasksPage.goto();
    await tasksPage.createTask({ title: task.title, status: 'pending' });
    await tasksPage.editTask(task.title);

    await page.getByTestId('task-status-select').selectOption('completed');
    await page.getByTestId('task-submit-btn').click();
    await expect(page.getByTestId('task-form-modal')).not.toBeVisible({ timeout: 5000 });

    const card = tasksPage.getCard(task.title);
    await expect(card.locator('text=Completada')).toBeVisible({ timeout: 5000 });
  });

  test('actualiza la prioridad de la tarea', async ({ page }) => {
    const task = TaskFactory.minimal({ title: 'Cambiar prioridad' });
    const tasksPage = new TasksPage(page);
    await tasksPage.goto();
    await tasksPage.createTask({ title: task.title, priority: 'low' });
    await tasksPage.editTask(task.title);

    await page.getByTestId('task-priority-select').selectOption('high');
    await page.getByTestId('task-submit-btn').click();
    await expect(page.getByTestId('task-form-modal')).not.toBeVisible({ timeout: 5000 });

    const card = tasksPage.getCard(task.title);
    await expect(card.locator('text=Alta')).toBeVisible({ timeout: 5000 });
  });
});
