import { useTranslation } from 'react-i18next';

import { Banner, BannerProps } from 'shared/components/Banners/Banner';

export const DuplicateRowsErrorBanner = (props: BannerProps) => {
  const { t } = useTranslation('app', { keyPrefix: 'activityAssign' });

  return (
    <Banner severity="error" hasCloseButton={false} duration={null} {...props}>
      {t('duplicateRowsError')}
    </Banner>
  );
};
