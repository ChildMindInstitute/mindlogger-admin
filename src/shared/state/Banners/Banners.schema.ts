export const BannerComponents = {
  // TODO: add available banner components here
};

export type BannerPayload = {
  key: keyof typeof BannerComponents;
};

export type BannerSchema = {
  data: {
    banners: Array<BannerPayload>;
  };
};
