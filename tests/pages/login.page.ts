import {BasePage} from "./base.page";
import {Locator, Page} from "@playwright/test";
import {AuthSelectors} from "../utils/selectors/auth.selectors";

export class LoginPage extends BasePage {
  readonly email: Locator;
  readonly password: Locator;
  readonly submit: Locator;

  public constructor(page: Page) {
    super(page);
    this.email = page.locator(AuthSelectors.fields.username);
    this.password = page.locator(AuthSelectors.fields.password);
    this.submit = page.locator(AuthSelectors.fields.submitButton);
  }

  get urlPath(): string { return "/auth"; }


  async login(email: string, password: string) {
    await this.email.fill(email);
    await this.password.fill(password);
    await this.submit.click();
  }



}
