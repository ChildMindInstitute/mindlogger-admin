import { useTranslation } from 'react-i18next';

import { Banner, BannerProps } from '../Banner';
import { SAVE_SUCCESS_BANNER_DURATION } from './SaveSuccessBanner.const';

export const SaveSuccessBanner = ({ children, ...props }: BannerProps) => {
  const { t } = useTranslation('app');

  return (
    <Banner duration={SAVE_SUCCESS_BANNER_DURATION} severity="success" {...props}>
      {children ?? t('saveSuccess')}
    </Banner>
  );
};
