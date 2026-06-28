import { Page, expect } from '@playwright/test';

export class DashboardPage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async goto() {
    await this.page.goto('/dashboard');
    await expect(this.page).toHaveURL(/\/dashboard/, { timeout: 8000 });
  }

  async expectGreeting(name?: string) {
    const greeting = name
      ? this.page.getByText(`¡Hola, ${name}`)
      : this.page.getByText('¡Hola,');
    await expect(greeting).toBeVisible({ timeout: 8000 });
  }

  async expectStatCards() {
    await expect(this.page.getByText('Total')).toBeVisible();
    await expect(this.page.getByText('Pendientes')).toBeVisible();
    await expect(this.page.getByText('En progreso')).toBeVisible();
    await expect(this.page.getByText('Completadas')).toBeVisible();
  }

  async expectDonutChart() {
    await expect(this.page.getByText('Distribución de tareas')).toBeVisible();
  }

  async navigateToTasks() {
    await this.page.getByTestId('nav-tasks').click();
    await expect(this.page).toHaveURL(/\/tasks/, { timeout: 5000 });
  }

  async navigateToNotifications() {
    await this.page.getByTestId('nav-notifications').click();
    await expect(this.page).toHaveURL(/\/notifications/, { timeout: 5000 });
  }
}
