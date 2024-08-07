import { useTranslation } from 'react-i18next';

import { Svg } from 'shared/components';
import { Banner, BannerProps } from 'shared/components/Banners/Banner';

export const SubjectAutofillBanner = (props: BannerProps) => {
  const { t } = useTranslation('app', { keyPrefix: 'activityAssign' });

  return (
    <Banner
      severity="warning"
      iconMapping={{ warning: <Svg id="user-check" width={32} height={32} fill="currentColor" /> }}
      hasCloseButton={false}
      duration={8000}
      {...props}
    >
      {t('subjectAutofill')}
    </Banner>
  );
};
