import { Locator, Page } from '@playwright/test';
import { BasePage } from './base.page';

export class SettingsPage extends BasePage {
  readonly heading: Locator;
  readonly oldPasswordInput: Locator;
  readonly newPasswordInput: Locator;
  readonly confirmPasswordInput: Locator;
  readonly submitButton: Locator;
  readonly successMessage: Locator;

  constructor(page: Page) {
    super(page);
    this.heading = page.getByRole('heading', { name: 'Change Password' });
    this.oldPasswordInput = page.getByRole('textbox', { name: 'Old Password' });
    this.newPasswordInput = page.getByRole('textbox', { name: 'New Password' });
    this.confirmPasswordInput = page.getByRole('textbox', { name: 'Confirm Password' });
    this.submitButton = page.getByRole('button', { name: 'Submit' });
    this.successMessage = page.getByTestId('system-success-message');
  }

  get urlPath() { return '/protected/settings'; }

  async changePassword(oldPassword: string, newPassword: string, confirmPassword: string) {
    await this.oldPasswordInput.fill(oldPassword);
    await this.newPasswordInput.fill(newPassword);
    await this.confirmPasswordInput.fill(confirmPassword);
    await this.submitButton.click();
  }
}
