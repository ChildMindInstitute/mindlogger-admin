import { Trans } from 'react-i18next';

import { Banner, BannerProps } from 'shared/components/Banners/Banner';

export const SoftLockWarningBanner = (props: BannerProps) => (
  <Banner duration={null} severity="warning" {...props}>
    <Trans i18nKey="softLockWarningBanner">
      <strong>To keep your account secure, you were automatically logged out.</strong>
      <div>Please enter your password below to resume where you left off.</div>
    </Trans>
  </Banner>
);
