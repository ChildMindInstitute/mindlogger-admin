import { Locator, Page } from '@playwright/test';
import { BasePage } from './base.page';
import {AuthSelectors} from "../utils/selectors/auth.selectors";

export class SignupPage extends BasePage {
  readonly emailInput: Locator;
  readonly firstNameInput: Locator;
  readonly lastNameInput: Locator;
  readonly passwordInput: Locator;
  readonly confirmPasswordInput: Locator;
  readonly termsCheckbox: Locator;
  readonly createAccountButton: Locator;
  readonly createAccountLink: Locator;
  readonly heading: Locator;

  constructor(page: Page) {
    super(page);
    this.emailInput = page.locator(AuthSelectors.fields.email);
    this.firstNameInput = page.locator(AuthSelectors.fields.firstName);
    this.lastNameInput = page.locator(AuthSelectors.fields.lastName);
    this.passwordInput = page.locator(AuthSelectors.fields.password);
    this.confirmPasswordInput = page.locator(AuthSelectors.fields.confirmPassword);
    this.termsCheckbox = page.getByRole('checkbox', { name: 'I agree to the Terms of Service' });
    this.createAccountButton = page.getByRole('button', { name: 'Create Account' });
    this.createAccountLink = page.getByText('Create an account');
    this.heading = page.getByRole('heading', { name: 'Create Account' });
  }

  get urlPath() { return '/signup'; }

  async navigateFromLogin() {
    await this.page.goto('/login');
    await this.createAccountLink.click();
    await this.page.waitForURL('/signup');
  }

  async fillForm(email: string, firstName: string, lastName: string, password: string) {
    await this.emailInput.fill(email);
    await this.firstNameInput.fill(firstName);
    await this.lastNameInput.fill(lastName);
    await this.passwordInput.fill(password);
    await this.confirmPasswordInput.fill(password);
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
