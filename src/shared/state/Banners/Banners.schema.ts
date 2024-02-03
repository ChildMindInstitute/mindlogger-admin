import { AppletWithoutChangesBanner } from 'modules/Builder/components';
import { VersionWarningBanner } from 'shared/components';

export const BannerComponents = {
  AppletWithoutChangesBanner,
  VersionWarningBanner,
};

export type BannerPayload = {
  key: keyof typeof BannerComponents;
};

export type BannersSchema = {
  data: {
    banners: Array<BannerPayload>;
  };
};
