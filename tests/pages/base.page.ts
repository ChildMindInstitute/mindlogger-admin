import { Page, Locator, expect } from '@playwright/test';
import {runtimeConfig} from "../config";

export abstract class BasePage {
  protected readonly page: Page;

  protected constructor(page: Page) {
    this.page = page;
  }

  get basePage(): Page { return this.page }

  // Override in subclasses to provide a path (e.g., '/login')
  get urlPath(): string | null { return null; }

  /**
   * Each page object should implement and know how to navigate to itself
   */
  async goto() {
    const path = this.urlPath;
    if (!path) throw new Error('Page has no urlPath defined.');

    const url = new URL(path, runtimeConfig.baseURL).toString();
    await this.page.goto(url, { waitUntil: 'domcontentloaded' });
  }

  protected buildUrl(path: string): string {
    return `${runtimeConfig.baseURL}/${path}`;
  }


  locatorByTestId(id: string): Locator {
    return this.page.getByTestId(id);
  }

  async expectUrl(contains: RegExp | string) {
    await expect(this.page).toHaveURL(contains);
  }
}
