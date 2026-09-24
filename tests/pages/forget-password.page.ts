import { Locator, Page } from '@playwright/test';
import { BasePage } from './base.page';
import {AuthSelectors} from "../utils/selectors/auth.selectors";

export class ForgotPasswordPage extends BasePage {
  readonly emailInput: Locator;
  readonly submitButton: Locator;

  constructor(page: Page) {
    super(page);
    this.emailInput = page.getByRole('textbox', { name: 'Email' });
    this.submitButton = page.getByTestId('reset-form-reset');
  }

  get urlPath() { return '/auth/reset-password'; }

  async requestReset(email: string) {
    await this.emailInput.fill(email);
    await this.submitButton.click();
  }
}
