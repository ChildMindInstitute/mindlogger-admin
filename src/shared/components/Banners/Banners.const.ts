import { ComponentType } from 'react';

import { BannerType } from 'redux/modules';
import { AppletWithoutChangesBanner } from 'modules/Builder/components';
import { VersionWarningBanner } from 'shared/components/Banners/VersionWarningBanner';

import { BannerProps } from './Banner';

export const BannerComponents: Record<keyof typeof BannerType, ComponentType<BannerProps>> = {
  AppletWithoutChangesBanner,
  VersionWarningBanner,
};
