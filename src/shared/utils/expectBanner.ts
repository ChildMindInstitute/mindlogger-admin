import { BannerType } from 'redux/modules';
import { AppStore } from 'redux/store';

/**
 * Jest utility to determine if the banner having the given key has been rendered
 * based on the current state of Redux store.
 */
export const expectBanner = (store: AppStore, key: keyof typeof BannerType) => {
  expect(
    store.getState().banners.data.banners.find((payload) => payload.key === key),
  ).toBeDefined();
};
