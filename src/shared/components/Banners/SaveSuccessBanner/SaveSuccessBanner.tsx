import { useTranslation } from 'react-i18next';

import { Banner, BannerProps } from '../Banner';

export const SaveSuccessBanner = ({ children, ...props }: BannerProps) => {
  const { t } = useTranslation('app');

  return (
    <Banner duration={3500} severity="success" data-testid="save-success-banner" {...props}>
      {children ?? t('saveSuccess')}
    </Banner>
  );
};
