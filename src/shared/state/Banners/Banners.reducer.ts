import { PayloadAction } from '@reduxjs/toolkit';

import { BannerPayload, BannerSchema } from './Banners.schema';

export const reducers = {
  addBanner: (state: BannerSchema, { payload }: PayloadAction<BannerPayload>): void => {
    state.data.banners.push(payload);
  },
  removeBanner: (state: BannerSchema, { payload }: PayloadAction<BannerPayload>): void => {
    state.data.banners = state.data.banners.filter(({ key }) => key !== payload.key);
  },
  removeAllBanners: (state: BannerSchema): void => {
    state.data.banners = [];
  },
};
