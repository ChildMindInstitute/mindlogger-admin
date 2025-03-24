import { ComponentType } from 'react';

import { BannerType } from 'redux/modules';
import {
  PasswordResetSuccessfulBanner,
  SoftLockWarningBanner,
} from 'modules/Auth/features/Login/Banners';
import { AppletWithoutChangesBanner } from 'modules/Builder/components';
import { FileSizeExceededBanner } from 'shared/components/Banners/FileSizeExceededBanner';
import { IncorrectFileBanner } from 'shared/components/Banners/IncorrectFileBanner';
import { SaveSuccessBanner } from 'shared/components/Banners/SaveSuccessBanner';
import { VersionWarningBanner } from 'shared/components/Banners/VersionWarningBanner';
import { TransferOwnershipSuccessBanner } from 'shared/components/Banners/TransferOwnershipSuccessBanner';
import { AddParticipantSuccessBanner } from 'modules/Dashboard/components/Banners';

import { EHRBannerAvailable, EHRBannerActive } from './EHRBanners';
import { BannerProps } from './Banner';

export const BannerComponents: Record<keyof typeof BannerType, ComponentType<BannerProps>> = {
  AppletWithoutChangesBanner,
  FileSizeExceededBanner,
  IncorrectFileBanner,
  PasswordResetSuccessfulBanner,
  SaveSuccessBanner,
  VersionWarningBanner,
  TransferOwnershipSuccessBanner,
  AddParticipantSuccessBanner,
  SoftLockWarningBanner,
  EHRBannerAvailable,
  EHRBannerActive,
};
