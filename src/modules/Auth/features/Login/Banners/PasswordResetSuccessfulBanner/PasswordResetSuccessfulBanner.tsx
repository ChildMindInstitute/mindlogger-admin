import { useTranslation } from 'react-i18next';

import { Banner, BannerProps } from 'shared/components/Banners/Banner';

export const PasswordResetSuccessfulBanner = (props: BannerProps) => {
  const { t } = useTranslation('app');

  return (
    <Banner {...props} severity="success">
      {t('passwordResetSuccessful')}
    </Banner>
  );
};
