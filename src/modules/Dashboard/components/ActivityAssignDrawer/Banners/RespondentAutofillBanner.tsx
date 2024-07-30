import { useTranslation } from 'react-i18next';

import { Svg } from 'shared/components';
import { Banner, BannerProps } from 'shared/components/Banners/Banner';

export const RespondentAutofillBanner = ({ name, hasActivity, ...rest }: BannerProps) => {
  const { t } = useTranslation('app', { keyPrefix: 'activityAssign' });

  return (
    <Banner
      severity="success"
      iconMapping={{ success: <Svg id="user-check" width={32} height={32} fill="currentColor" /> }}
      hasCloseButton={false}
      duration={7000}
      {...rest}
    >
      {hasActivity ? t('respondentActivityAutofill') : t('respondentAutofill', { name })}
    </Banner>
  );
};
