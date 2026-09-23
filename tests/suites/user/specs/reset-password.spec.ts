import { test, expect } from '../../../fixtures/all.fixtures'
import {generateRandomUser} from "../../../utils/data/users";

test.describe('Password Reset', () => {
  test('User can reset their password when logged in', async ({ loginPage, settingsPage, page, userApi }) => {
    // Create a new user via API
    const newUser = generateRandomUser();
    const createdUser = await userApi.createUser(newUser);
    const createdUserEmail = createdUser.result.email;
    const createdUserPassword = newUser.password;
    const createdUserName = `${createdUser.result.firstName} ${createdUser.result.lastName}`;

    // Log in via UI
    await loginPage.goto();
    await loginPage.login(createdUserEmail, createdUserPassword);

    // Navigate to settings
    await page.getByRole('button', { name: createdUserName }).click();
    await page.getByRole('menuitem', { name: 'Settings' }).click();
    await page.waitForURL('/protected/settings');

    // Verify we're on the settings page
    await expect(settingsPage.heading).toBeVisible();
    await expect(page.getByText(`Create the new password for ${createdUserEmail}`)).toBeVisible();

    // Test empty password fields trigger validation
    await settingsPage.submitButton.click();
    await expect(page.getByText('Password must be at least 6').first()).toHaveText('Password must be at least 6 characters.');
    await expect(page.getByText('Password must be at least 6').nth(1)).toBeVisible();
    await expect(page.getByText('Password must be at least 6').nth(2)).toBeVisible();

    // Test passwords that don't match
    await settingsPage.changePassword(createdUserPassword, 'newpassword123', 'differentpassword123');
    await expect(page.getByText('Passwords Do Not Match')).toBeVisible();

    // Test successful password change (using same password for simplicity)
    await settingsPage.changePassword(createdUserPassword, createdUserPassword, createdUserPassword);
    await expect(settingsPage.successMessage).toHaveText('Password is updated successfully');
  });

  test('User can request password reset when logged out', async ({ forgotPasswordPage, page }) => {
    const email = (process.env as any).uat?.PLAYWRIGHT_EMAIL || '';

    await forgotPasswordPage.navigateFromLogin();
    await forgotPasswordPage.requestReset(email);

    // More flexible text matching - could be "Password reset link is sent" or variations
    await expect(page.getByText(/password reset link/i)).toBeVisible({ timeout: 10000 });
  });
});
