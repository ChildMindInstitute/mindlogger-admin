import { useTranslation } from 'react-i18next';

import { Banner, BannerProps } from 'shared/components/Banners/Banner';

export const AppletWithoutChangesBanner = (props: BannerProps) => {
  const { t } = useTranslation('app');

  return (
    <Banner {...props} severity="info">
      {t('pleaseMakeChangesToApplet')}
    </Banner>
  );
};
