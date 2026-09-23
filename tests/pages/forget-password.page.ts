import { Locator, Page } from '@playwright/test';
import { BasePage } from './base.page';
import {AuthSelectors} from "../utils/selectors/auth.selectors";

export class ForgotPasswordPage extends BasePage {
  readonly emailInput: Locator;
  readonly submitButton: Locator;
  readonly forgotPasswordLink: Locator;

  constructor(page: Page) {
    super(page);
    this.emailInput = page.locator(AuthSelectors.fields.email);
    this.submitButton = page.locator(AuthSelectors.fields.submitButton);
    this.forgotPasswordLink = page.getByText('Forgot Password?');
  }

  get urlPath() { return '/forgot-password'; }

  async navigateFromLogin() {
    await this.page.goto('/login');
    await this.forgotPasswordLink.click();
  }

  async requestReset(email: string) {
    await this.emailInput.fill(email);
    await this.submitButton.click();
  }
}
