import { APIRequestContext } from '@playwright/test';

/**
 * Base class for Curious API operations
 */
export abstract class CuriousApi {

  protected apiContext: APIRequestContext

  /**
   *
   * @param apiContext a fully built context with authentication already applied
   */
  constructor(apiContext: APIRequestContext) {
    this.apiContext = apiContext
  }

  async dispose() {
    await this.apiContext.dispose();
  }

}
