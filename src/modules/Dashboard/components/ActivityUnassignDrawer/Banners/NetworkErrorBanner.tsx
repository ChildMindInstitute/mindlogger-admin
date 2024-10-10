import { useTranslation } from 'react-i18next';

import { Banner, BannerProps } from 'shared/components/Banners/Banner';

export const NetworkErrorBanner = (props: BannerProps) => {
  const { t } = useTranslation('app', { keyPrefix: 'activityAssign' });

  return (
    <Banner severity="error" hasCloseButton={false} {...props}>
      {t('networkError')}
    </Banner>
  );
};
