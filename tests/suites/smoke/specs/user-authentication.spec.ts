import { test, expect } from '../../../fixtures/pages.fixture'
import {AuthSelectors} from "../../../utils/selectors/auth.selectors";

test.describe('User Authentication', () => {
  test('User is logged in', async ({page, appletListPage}) => {
    await appletListPage.goto();
    await expect(page).toHaveURL(AuthSelectors.loggedInPath);
  })

  // test('User receives error message when no login credentials are used', async ({ loginPage, page }) => {
  //   await loginPage.goto();
  //   await loginPage.login('', '');
  //
  //   await expect(page.getByText('Email must be valid.')).toHaveText('Email must be valid.');
  //   await expect(page.getByText('Password is required.')).toHaveText('Password is required.');
  // });
  //
  // test('User receives an error message when using incorrect login credentials', async ({ loginPage, page }) => {
  //   await loginPage.goto();
  //   await loginPage.login('wrongemail@email.com', 'wrongpassword');
  //
  //   await expect(page.getByTestId('error-banner')).toBeVisible();
  // });
  //
  // test('Unauthenticated user is redirected to /login when accessing protected page', async ({ page }) => {
  //   await page.goto('/protected/applets');
  //   await page.waitForURL('/login');
  //   await expect(page).toHaveURL('/login');
  // });
  //
  // test('Authenticated user can navigate directly to a protected page', async ({ page }) => {
  //   await page.goto('/protected/profile');
  //   await expect(page).toHaveURL('/protected/profile');
  //   // Checking text like this is flakey
  //   // const profileText = 'Thank you for creating an account with Curious. Download Curious on an iOS or Android device to get started.';
  //   // await expect(page.getByText(profileText)).toBeVisible();
  // });
});
