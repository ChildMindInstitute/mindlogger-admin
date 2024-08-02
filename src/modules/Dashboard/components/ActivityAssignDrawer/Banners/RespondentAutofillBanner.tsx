import { useTranslation } from 'react-i18next';

import { Svg } from 'shared/components';
import { Banner, BannerProps } from 'shared/components/Banners/Banner';

export const RespondentAutofillBanner = ({
  name,
  hasActivity,
  isTeamMember,
  ...rest
}: BannerProps) => {
  const { t } = useTranslation('app', { keyPrefix: 'activityAssign' });

  let text: string;
  if (hasActivity) {
    text = isTeamMember
      ? t('teamRespondentActivityAutofill', { name })
      : t('respondentActivityAutofill', { name });
  } else {
    text = isTeamMember ? t('teamRespondentAutofill', { name }) : t('respondentAutofill', { name });
  }

  return (
    <Banner
      severity="success"
      iconMapping={{ success: <Svg id="user-check" width={32} height={32} fill="currentColor" /> }}
      hasCloseButton={false}
      duration={7000}
      {...rest}
    >
      {text}
    </Banner>
  );
};
