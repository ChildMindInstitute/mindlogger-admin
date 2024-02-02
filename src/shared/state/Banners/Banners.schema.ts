import { VersionWarningBanner } from 'shared/components';

export const BannerComponents = {
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
