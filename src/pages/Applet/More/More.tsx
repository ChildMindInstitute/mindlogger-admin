import { useTranslation } from 'react-i18next';

import { Svg } from 'components/Svg';
import { useBreadcrumbs } from 'hooks';

import { Navigation } from './Navigation';

export const More = () => {
  const { t } = useTranslation('app');

  useBreadcrumbs([
    {
      icon: <Svg id="dots-filled" width="15" height="15" />,
      label: t('more'),
    },
  ]);

  return <Navigation />;
};
