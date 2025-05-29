import { Link } from '@mui/material';
import { Trans } from 'react-i18next';

import { Banner, BannerProps } from '../Banner';
import { VERSION_WARNING_BANNER_LINK } from './VersionWarningBanner.const';

export const VersionWarningBanner = (props: BannerProps) => (
  <Banner duration={null} severity="warning" {...props}>
    <Trans i18nKey="versionWarningBanner">
      <strong>You are using the new version of Curious!</strong>
      <>End users must update to the new app.</>
      <Link target="_blank" href={VERSION_WARNING_BANNER_LINK}>
        Take these steps now to ensure participant response data is not lost.
      </Link>
    </Trans>
  </Banner>
);
