import { Link } from '@mui/material';
import { Trans } from 'react-i18next';

import { Banner, BannerProps } from 'shared/components';

import { BANNER_LINK } from './VersionWarningBanner.const';

export const VersionWarningBanner = (props: BannerProps) => (
  <Banner {...props} duration={null} severity="warning">
    <Trans i18nKey="versionWarningBanner">
      <strong>You are using the new version of MindLogger!</strong>
      <>End users must update to the new app.</>
      <Link target="_blank" href={BANNER_LINK}>
        Take these steps now to ensure participant response data is not lost.
      </Link>
    </Trans>
  </Banner>
);
