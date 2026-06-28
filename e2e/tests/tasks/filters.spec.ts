import { test } from '@playwright/test';
import { TasksPage } from '../../pages/TasksPage';
import { ScenarioBuilder, TestScenario } from '../../data';
import { DataHelper } from '../../helpers/data.helper';

test.describe('Tasks > Filtros', () => {
  let scenario: TestScenario;

  test.beforeAll(async () => {
    scenario = await new ScenarioBuilder()
      .withUser({ tag: 'filters' })
      .withTask({ title: 'Tarea pendiente filtro', status: 'pending', priority: 'low' })
      .withTask({ title: 'Tarea completada filtro', status: 'completed', priority: 'high' })
      .withTask({ title: 'Tarea en progreso filtro', status: 'in_progress', priority: 'medium' })
      .build();
  });

  test.afterAll(async () => {
    await scenario.cleanup();
  });

  test.beforeEach(async ({ page }) => {
    await DataHelper.injectAuth(page, scenario);
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
