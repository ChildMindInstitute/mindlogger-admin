import { Link } from '@mui/material';
import { Trans } from 'react-i18next';

import { Banner, BannerProps } from 'shared/components/Banners/Banner';

export const SessionElsewhereBanner = (props: BannerProps) => (
  <Banner duration={null} severity="warning" data-testid="session-elsewhere-banner" {...props}>
    <Trans i18nKey="sessionElsewhereBanner">
      <>You signed in with another tab or window.</>
      <Link component="button" onClick={() => window.location.reload()}>
        Reload
      </Link>
      <> to refresh your session.</>
    </Trans>
  </Banner>
);
