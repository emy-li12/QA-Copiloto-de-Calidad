import { test as base, Page } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { TasksPage } from '../pages/TasksPage';
import { NotificationsPage } from '../pages/NotificationsPage';
import { DashboardPage } from '../pages/DashboardPage';
import {
  TEST_USER,
  registerTestUser,
  loginViaAPI,
  setAuthInBrowser,
  cleanupTestTasks,
} from '../helpers/auth.helper';

export interface AuthFixtures {
  authenticatedPage: Page;
  token: string;
}

export interface PageFixtures {
  loginPage: LoginPage;
  tasksPage: TasksPage;
  notificationsPage: NotificationsPage;
  dashboardPage: DashboardPage;
}

export const test = base.extend<AuthFixtures & PageFixtures>({
  token: async ({}, use) => {
    await registerTestUser();
    const token = await loginViaAPI();
    await use(token);
  },

  authenticatedPage: async ({ page, token }, use) => {
    await setAuthInBrowser(page, token);
    await use(page);
  },

  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },

  tasksPage: async ({ authenticatedPage }, use) => {
    await use(new TasksPage(authenticatedPage));
  },

  notificationsPage: async ({ authenticatedPage }, use) => {
    const notifPage = new NotificationsPage(authenticatedPage);
    await cleanupTestTasks(
      await loginViaAPI()
    );
    await use(notifPage);
  },

  dashboardPage: async ({ authenticatedPage }, use) => {
    await use(new DashboardPage(authenticatedPage));
  },
});

export { expect } from '@playwright/test';
export { TEST_USER };
