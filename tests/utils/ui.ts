import {Page} from "@playwright/test";
import {AuthSelectors} from "./selectors/auth.selectors";

export const performUiLogin = async (page: Page, url: string, email: string, password: string) => {
  console.log(`Logging in to ${url}`);
  await page.goto(url);

  // Fill in login form
  await page.getByRole('textbox', { name: 'Email' }).click();
  await page.getByRole('textbox', { name: 'Email' }).fill(email);
  await page.getByRole('textbox', { name: 'Password' }).click();
  await page.getByRole('textbox', { name: 'Password' }).fill(password);

  // Submit the form
  await page.getByTestId('login-form-signin').click();
};
