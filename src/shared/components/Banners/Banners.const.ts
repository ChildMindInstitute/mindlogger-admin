import { ComponentType } from 'react';

import { BannerType } from 'redux/modules';
import { AppletWithoutChangesBanner } from 'modules/Builder/components';
import { SaveSuccessBanner } from 'shared/components/Banners/SaveSuccessBanner';
import { VersionWarningBanner } from 'shared/components/Banners/VersionWarningBanner';

import { BannerProps } from './Banner';

export const BannerComponents: Record<keyof typeof BannerType, ComponentType<BannerProps>> = {
  AppletWithoutChangesBanner,
  SaveSuccessBanner,
  VersionWarningBanner,
};
