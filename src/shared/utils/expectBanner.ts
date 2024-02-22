import { AppStore } from 'redux/store';

/**
 * Jest utility to determine if the banner having the given testId has been rendered
 * based on the current state of Redux store.
 */
export const expectBanner = (store: AppStore, testId: string) => {
  expect(
    store
      .getState()
      .banners.data.banners.find(({ bannerProps }) => bannerProps?.['data-testid'] === testId),
  ).toBeDefined();
};
