import {chromium, expect, test as setup} from '@playwright/test';
import {runtimeConfig} from "../config";
import {writeStorageFile} from "../utils/file";
import {AuthSelectors} from "../utils/selectors/auth.selectors";
import {performUiLogin} from "../utils/ui";
import {performLogin} from "../utils/api";


const globalSetup =  async () => {
  // Perform an API level login
  // const userAccessToken = await performLogin(runtimeConfig.userEmail, runtimeConfig.userPassword)
  // writeStorageFile(JSON.stringify({ accessToken: userAccessToken }, null, 2), runtimeConfig.userTokenFile)
  //
  // const adminAccessToken = await performLogin(runtimeConfig.adminUserEmail, runtimeConfig.adminUserPassword)
  // writeStorageFile(JSON.stringify({ accessToken: adminAccessToken }, null, 2), runtimeConfig.adminTokenFile)
  //
  // // Perform a GUI login for browser tests
  // const browser = await chromium.launch();
  // const context = await browser.newContext();
  // const page = await context.newPage();
  //
  // await performUiLogin(page, `${runtimeConfig.baseURL}/auth`, process.env.PLAYWRIGHT_USER_EMAIL || '', process.env.PLAYWRIGHT_USER_PASSWORD || '');
  //
  // await expect(page).toHaveURL(AuthSelectors.loggedInPath);
  //
  // await page.context().storageState({ path: runtimeConfig.storageState });
};



export default globalSetup;
