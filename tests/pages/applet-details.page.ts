import { Locator, Page } from '@playwright/test';
import { BasePage } from './base.page';

export class AppletDetailsPage extends BasePage {
  readonly availableHeading: Locator;
  readonly startButton: Locator;
  readonly progressBar: Locator;
  readonly nextButton: Locator;
  readonly warningBanner: Locator;
  readonly selectBox: Locator;
  readonly popupPrimaryButton: Locator;
  readonly successBanner: Locator;

  constructor(page: Page) {
    super(page);
    this.availableHeading = page.getByRole('heading', { name: 'Available' });
    this.startButton = page.getByRole('button', { name: 'Start' });
    this.progressBar = page.getByRole('progressbar');
    this.nextButton = page.getByRole('button', { name: 'Next' });
    this.warningBanner = page.getByTestId('warning-banner');
    this.selectBox = page.getByTestId('select-box');
    this.popupPrimaryButton = page.getByTestId('popup-primary-button');
    this.successBanner = page.getByTestId('success-banner');
  }

  async startActivity() {
    await this.startButton.click();
  }

  async clickNext() {
    await this.nextButton.click();
  }

  async selectOption() {
    await this.selectBox.click();
  }

  async submitActivity() {
    await this.popupPrimaryButton.click();
  }

}
