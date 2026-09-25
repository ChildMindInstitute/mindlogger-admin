import { expect, test as setup} from '@playwright/test';
import {runtimeConfig} from "../config";
import {AuthSelectors} from "../utils/selectors/auth.selectors";
import {performUiLogin} from "../utils/ui";


// For future reference, to login as different people and keep their creds
setup('authenticate as admin', async ({ page }) => {

  await performUiLogin(page, AuthSelectors.loginPath, process.env.PLAYWRIGHT_ADMIN_EMAIL || '', process.env.PLAYWRIGHT_ADMIN_PASSWORD || '');
  await expect(page).toHaveURL(AuthSelectors.loggedInPath);
  await page.context().storageState({ path: runtimeConfig.adminTokenFile });
});
