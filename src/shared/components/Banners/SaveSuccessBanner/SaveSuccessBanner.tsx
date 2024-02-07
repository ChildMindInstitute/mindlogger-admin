import { useTranslation } from 'react-i18next';

import { Banner, BannerProps } from '../Banner';

export const SaveSuccessBanner = (props: BannerProps) => {
  const { t } = useTranslation('app');

  return (
    <Banner duration={3500} severity="success" data-testid="save-success-banner" {...props}>
      {t('saveSuccess')}
    </Banner>
  );
};
