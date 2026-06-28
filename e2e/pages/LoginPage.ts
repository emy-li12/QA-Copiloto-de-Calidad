import { Page, Locator, expect } from '@playwright/test';

export class LoginPage {
  readonly page: Page;
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly submitBtn: Locator;
  readonly goToRegisterLink: Locator;

  constructor(page: Page) {
    this.page = page;
    this.emailInput = page.getByTestId('login-email-input');
    this.passwordInput = page.getByTestId('login-password-input');
    this.submitBtn = page.getByTestId('login-submit-btn');
    this.goToRegisterLink = page.getByTestId('go-to-register-link');
  }

  async goto() {
    await this.page.goto('/login');
  }

  async login(email: string, password: string) {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.submitBtn.click();
  }

  async expectFormVisible() {
    await expect(this.emailInput).toBeVisible();
    await expect(this.passwordInput).toBeVisible();
    await expect(this.submitBtn).toBeVisible();
  }

  async expectRedirectedToDashboard() {
    await expect(this.page).toHaveURL(/\/dashboard/, { timeout: 8000 });
  }

  async expectStaysOnLogin() {
    await expect(this.page).toHaveURL(/\/login/);
  }

  async expectErrorToast() {
    await expect(
      this.page.locator('[role="status"]').or(this.page.locator('.react-hot-toast'))
    ).toBeVisible({ timeout: 5000 });
  }
}
