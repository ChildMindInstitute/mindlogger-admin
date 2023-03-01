import { useTranslation } from 'react-i18next';

import { Svg } from 'components';
import { useBreadcrumbs } from 'hooks';

import { ItemConfiguration } from './ItemConfiguration';

export const ActivityItems = () => {
  const { t } = useTranslation('app');

  useBreadcrumbs([
    {
      icon: <Svg id="item-outlined" width="18" height="18" />,
      label: t('items'),
    },
  ]);

  return <ItemConfiguration />;
};
