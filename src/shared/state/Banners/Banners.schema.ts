import { AppletWithoutChangesBanner } from 'modules/Builder/components/Banners';
import { VersionWarningBanner } from 'shared/components/Banners/VersionWarningBanner';

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
