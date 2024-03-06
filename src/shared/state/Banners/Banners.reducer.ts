import { PayloadAction } from '@reduxjs/toolkit';

import { BannerPayload, BannersSchema } from './Banners.schema';

export const reducers = {
  addBanner: (state: BannersSchema, { payload }: PayloadAction<BannerPayload>): void => {
    state.data.banners.push(payload);
  },
  removeBanner: (
    state: BannersSchema,
    { payload }: PayloadAction<Pick<BannerPayload, 'key'>>,
  ): void => {
    state.data.banners = state.data.banners.filter(({ key }) => key !== payload.key);
  },
  removeAllBanners: (state: BannersSchema): void => {
    state.data.banners = [];
  },
};
