import { useTranslation } from 'react-i18next';

import { Banner, BannerProps } from 'shared/components/Banners/Banner';

export const ExistingAssignmentsBanner = (props: BannerProps) => {
  const { t } = useTranslation('app', { keyPrefix: 'activityAssign' });

  return (
    <Banner severity="warning" hasCloseButton={false} duration={null} {...props}>
      {t('existingAssignments')}
    </Banner>
  );
};
