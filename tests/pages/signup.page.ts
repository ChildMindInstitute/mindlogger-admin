import { Locator, Page } from '@playwright/test';
import { BasePage } from './base.page';
import {AuthSelectors} from "../utils/selectors/auth.selectors";

export class SignupPage extends BasePage {
  readonly emailInput: Locator;
  readonly firstNameInput: Locator;
  readonly lastNameInput: Locator;
  readonly passwordInput: Locator;
  readonly termsCheckbox: Locator;
  readonly createAccountButton: Locator;

  constructor(page: Page) {
    super(page);
    this.emailInput = page.getByRole('textbox', { name: AuthSelectors.role.email });
    this.firstNameInput = page.getByRole('textbox', { name: AuthSelectors.role.firstName });
    this.lastNameInput = page.getByRole('textbox', { name: AuthSelectors.role.lastName });
    this.passwordInput = page.getByRole('textbox', { name: AuthSelectors.role.password });
    this.termsCheckbox = page.getByRole('checkbox', { name: AuthSelectors.role.terms });
    this.createAccountButton = page.getByTestId(AuthSelectors.testId.createAccountButton);
  }

  get urlPath() { return '/signup'; }


  async fillForm(email: string, firstName: string, lastName: string, password: string) {
    await this.emailInput.fill(email);
    await this.firstNameInput.fill(firstName);
    await this.lastNameInput.fill(lastName);
    await this.passwordInput.fill(password);
  }

  async acceptTerms() {
    await this.termsCheckbox.check();
  }

  async submit() {
    await this.createAccountButton.click();
  }

  async createAccount(email: string, firstName: string, lastName: string, password: string) {
    await this.fillForm(email, firstName, lastName, password);
    await this.acceptTerms();
    await this.submit();
  }
}
