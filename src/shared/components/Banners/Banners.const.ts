import { ComponentType } from 'react';

import { BannerType } from 'redux/modules';
import { AppletWithoutChangesBanner } from 'modules/Builder/components';
import { FileSizeExceededBanner } from 'shared/components/Banners/FileSizeExceededBanner';
import { IncorrectFileBanner } from 'shared/components/Banners/IncorrectFileBanner';
import { SaveSuccessBanner } from 'shared/components/Banners/SaveSuccessBanner';
import { VersionWarningBanner } from 'shared/components/Banners/VersionWarningBanner';
import { TransferOwnershipSuccessBanner } from 'shared/components/Banners/TransferOwnershipSuccessBanner';

import { BannerProps } from './Banner';

export const BannerComponents: Record<keyof typeof BannerType, ComponentType<BannerProps>> = {
  AppletWithoutChangesBanner,
  FileSizeExceededBanner,
  IncorrectFileBanner,
  SaveSuccessBanner,
  VersionWarningBanner,
  TransferOwnershipSuccessBanner,
};
