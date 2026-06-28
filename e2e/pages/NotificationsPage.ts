import { Page, Locator, expect } from '@playwright/test';

export type NotificationSection = 'overdue' | 'today' | 'completed';

export class NotificationsPage {
  readonly page: Page;
  readonly sectionOverdue: Locator;
  readonly sectionToday: Locator;
  readonly sectionCompleted: Locator;

  constructor(page: Page) {
    this.page = page;
    this.sectionOverdue = page.getByTestId('section-overdue');
    this.sectionToday = page.getByTestId('section-today');
    this.sectionCompleted = page.getByTestId('section-completed');
  }

  async goto() {
    await this.page.goto('/notifications');
    await expect(this.page.getByTestId('notifications-page')).toBeVisible({ timeout: 8000 });
    // Wait for the loading spinner to disappear and sections to render
    await expect(this.sectionOverdue).toBeVisible({ timeout: 10000 });
  }

  async expectAllSectionsVisible() {
    await expect(this.sectionOverdue).toBeVisible();
    await expect(this.sectionToday).toBeVisible();
    await expect(this.sectionCompleted).toBeVisible();
  }

  async getSectionCount(section: NotificationSection): Promise<number> {
    const badge = this.page.getByTestId(`section-${section}`).locator('span').first();
    const text = await badge.textContent();
    return parseInt(text ?? '0', 10);
  }

  async expectEmptySection(section: NotificationSection) {
    const count = await this.getSectionCount(section);
    expect(count).toBe(0);
  }

  async expectSectionHasTasks(section: NotificationSection) {
    // Use Playwright's auto-retry: wait until a task title (h3) appears in the section
    await expect(
      this.page.getByTestId(`section-${section}`).locator('h3').first()
    ).toBeVisible({ timeout: 10000 });
  }

  async expectTaskInSection(section: NotificationSection, title: string) {
    await expect(
      this.page.getByTestId(`section-${section}`).getByText(title)
    ).toBeVisible({ timeout: 5000 });
  }

  async expectPageTitle() {
    await expect(this.page.getByRole('heading', { name: 'Notificaciones' })).toBeVisible();
  }
}
