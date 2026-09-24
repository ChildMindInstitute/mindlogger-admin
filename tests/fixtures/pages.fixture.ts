
import { test as base } from '@playwright/test';
import {AppletDetailsPage} from "../pages/applet-details.page";
import {AppletListPage} from "../pages/applet-list.page";
import {ForgotPasswordPage} from "../pages/forget-password.page";
import {LoginPage} from "../pages/login.page";
import {SignupPage} from "../pages/signup.page";


type PagesFixtures = {
  baseUrl: string,
  appletDetailsPage: AppletDetailsPage,
  appletListPage: AppletListPage,
  forgotPasswordPage: ForgotPasswordPage,
  loginPage: LoginPage,
  signupPage: SignupPage
}

export const test = base.extend<PagesFixtures>({

  appletDetailsPage: async ({ page }, use) => {
    const appletDetailsPage = new AppletDetailsPage(page)
    await use(appletDetailsPage);
  },

  appletListPage: async ({ page }, use) => {
    await use(new AppletListPage(page));
  },

  forgotPasswordPage: async ({ page }, use) => {
    await use(new ForgotPasswordPage(page));
  },

  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },

  signupPage: async ({ page }, use) => {
    await use(new SignupPage(page));
  },

})

export { expect } from '@playwright/test';
