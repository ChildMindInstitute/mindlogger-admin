import { BannerProps } from 'shared/components/Banners/Banner/Banner.types';

export enum BannerType {
  AppletWithoutChangesBanner,
  FileSizeExceededBanner,
  IncorrectFileBanner,
  SaveSuccessBanner,
  TransferOwnershipSuccessBanner,
  VersionWarningBanner,
  PasswordResetSuccessfulBanner,
  AddParticipantSuccessBanner,
  SoftLockWarningBanner,
}

export type BannerPayload = {
  key: keyof typeof BannerType;
  bannerProps?: BannerProps;
};

export type BannersSchema = {
  data: {
    banners: Array<BannerPayload>;
  };
};
