import { test, expect } from '../../../../fixtures/pages.fixture'

test.describe('Activity Completion', () => {
  test('User can complete an assessment and submit answers', async ({
    appletListPage,
    appletDetailsPage,
    page
  }) => {
    // Navigate to applets list
    await page.goto('/protected/applets');
    await expect(page).toHaveURL(/.*\/protected\/applets/);
    // Give the applet list more time to load and become visible
    await expect(appletListPage.appletList).toBeVisible({ timeout: 10000 });

    // Click on the first applet (or specific applet by name)
    // TODO: Update to use index 0 to ensure we select the first applet regardless of name
    await appletListPage.clickAppletByName('Applets1 tests');

    // Verify we're on the applet details page with available activities
    await expect(appletDetailsPage.availableHeading).toBeVisible();

    // Start the activity
    await appletDetailsPage.startActivity();

    // Verify progress bar is visible
    await expect(appletDetailsPage.progressBar).toBeVisible();

    // Click start to navigate to first question
    await appletDetailsPage.startActivity();

    // Try clicking next without selecting an option (should trigger warning)
    await appletDetailsPage.clickNext();
    await expect(appletDetailsPage.warningBanner).toBeVisible();

    // Select an option and proceed
    await appletDetailsPage.selectOption();
    await appletDetailsPage.clickNext();

    // Submit the activity
    await expect(appletDetailsPage.popupPrimaryButton).toBeVisible();
    await appletDetailsPage.submitActivity();

    // Verify submission success
    await expect(appletDetailsPage.popupPrimaryButton).toBeHidden();
    await expect(appletDetailsPage.successBanner).toBeVisible();
    await expect(appletDetailsPage.successBanner).toContainText('Done');
  });
});
