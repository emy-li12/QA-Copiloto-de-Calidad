import { Page, Locator, expect } from '@playwright/test';

export interface CreateTaskOptions {
  title: string;
  description?: string;
  status?: string;
  priority?: string;
}

export class TasksPage {
  readonly page: Page;
  readonly createBtn: Locator;
  readonly statusFilter: Locator;
  readonly priorityFilter: Locator;

  constructor(page: Page) {
    this.page = page;
    this.createBtn = page.getByTestId('task-create-btn');
    this.statusFilter = page.getByTestId('task-filters-status');
    this.priorityFilter = page.getByTestId('task-filters-priority');
  }

  async goto() {
    await this.page.goto('/tasks');
    await expect(this.page.getByTestId('tasks-page')).toBeVisible({ timeout: 8000 });
  }

  async openCreateModal() {
    await this.createBtn.click();
    await expect(this.page.getByTestId('task-form-modal')).toBeVisible();
  }

  async fillForm(opts: CreateTaskOptions) {
    await this.page.getByTestId('task-title-input').fill(opts.title);
    if (opts.description) {
      await this.page.getByTestId('task-description-input').fill(opts.description);
    }
    if (opts.status) {
      await this.page.getByTestId('task-status-select').selectOption(opts.status);
    }
    if (opts.priority) {
      await this.page.getByTestId('task-priority-select').selectOption(opts.priority);
    }
  }

  async submitForm() {
    await this.page.getByTestId('task-submit-btn').click();
    await expect(this.page.getByTestId('task-form-modal')).not.toBeVisible({ timeout: 5000 });
  }

  async createTask(opts: CreateTaskOptions) {
    await this.openCreateModal();
    await this.fillForm(opts);
    await this.submitForm();
  }

  async expectTaskCard(title: string) {
    await expect(
      this.page.getByTestId('task-card').filter({ hasText: title })
    ).toBeVisible({ timeout: 5000 });
  }

  async expectNoTaskCard(title: string) {
    await expect(
      this.page.getByTestId('task-card').filter({ hasText: title })
    ).not.toBeVisible({ timeout: 3000 });
  }

  async expectEmptyState() {
    await expect(this.page.locator('text=Aún no tienes tareas')).toBeVisible();
  }

  async editTask(title: string) {
    const card = this.page.getByTestId('task-card').filter({ hasText: title });
    await card.getByTestId('task-edit-btn').click();
    await expect(this.page.getByTestId('task-form-modal')).toBeVisible();
  }

  async deleteTask(title: string) {
    const card = this.page.getByTestId('task-card').filter({ hasText: title });
    await card.getByTestId('task-delete-btn').click();
    await expect(this.page.getByTestId('delete-confirm-modal')).toBeVisible();
    await this.page.getByTestId('delete-confirm-btn').click();
    await expect(this.page.getByTestId('delete-confirm-modal')).not.toBeVisible({ timeout: 5000 });
  }

  async filterByStatus(status: string) {
    await this.statusFilter.selectOption(status);
  }

  async filterByPriority(priority: string) {
    await this.priorityFilter.selectOption(priority);
  }

  async clearFilters() {
    await this.page.locator('text=Limpiar filtros').click();
  }

  getCard(title: string): Locator {
    return this.page.getByTestId('task-card').filter({ hasText: title });
  }
}
