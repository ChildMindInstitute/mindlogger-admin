import { useTranslation } from 'react-i18next';

import { Banner, BannerProps } from 'shared/components/Banners/Banner';

export const ExistingAssignmentsBanner = ({ allAssigned, ...props }: BannerProps) => {
  const { t } = useTranslation('app', { keyPrefix: 'activityAssign' });

  return (
    <Banner severity="warning" hasCloseButton={false} duration={null} {...props}>
      {t(allAssigned ? 'existingAssignmentsAll' : 'existingAssignments')}
    </Banner>
  );
};
