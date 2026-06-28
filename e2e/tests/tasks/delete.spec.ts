import { test, expect } from '@playwright/test';
import { TasksPage } from '../../pages/TasksPage';
import { TaskFactory } from '../../data/task.factory';
import { registerTestUser, loginViaAPI, setAuthInBrowser, cleanupTestTasks } from '../../helpers/auth.helper';

test.describe('Tasks > Eliminar tarea', () => {
  let token: string;

  test.beforeAll(async () => {
    await registerTestUser();
  });

  test.beforeEach(async ({ page }) => {
    token = await loginViaAPI();
    await cleanupTestTasks(token);
    await setAuthInBrowser(page, token);
  });

  test('muestra modal de confirmación con el nombre de la tarea', async ({ page }) => {
    const task = TaskFactory.minimal({ title: 'Confirmar borrado' });
    const tasksPage = new TasksPage(page);
    await tasksPage.goto();
    await tasksPage.createTask({ title: task.title });

    const card = tasksPage.getCard(task.title);
    await card.getByTestId('task-delete-btn').click();

    await expect(page.getByTestId('delete-confirm-modal')).toBeVisible();
    await expect(page.locator(`text="${task.title}"`)).toBeVisible();
  });

  test('cancelar el borrado mantiene la tarea en la lista', async ({ page }) => {
    const task = TaskFactory.minimal({ title: 'No borrar esta tarea' });
    const tasksPage = new TasksPage(page);
    await tasksPage.goto();
    await tasksPage.createTask({ title: task.title });

    const card = tasksPage.getCard(task.title);
    await card.getByTestId('task-delete-btn').click();
    await page.locator('text=Cancelar').click();

    await expect(page.getByTestId('delete-confirm-modal')).not.toBeVisible();
    await tasksPage.expectTaskCard(task.title);
  });

  test('confirmar borrado elimina la tarea de la lista', async ({ page }) => {
    const task = TaskFactory.minimal({ title: 'Eliminar definitivamente' });
    const tasksPage = new TasksPage(page);
    await tasksPage.goto();
    await tasksPage.createTask({ title: task.title });
    await tasksPage.deleteTask(task.title);
    await tasksPage.expectNoTaskCard(task.title);
  });
});
