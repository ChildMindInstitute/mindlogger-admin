import { useTranslation } from 'react-i18next';

import { Svg } from 'components/Svg';
import { useBreadcrumbs } from 'hooks';

export const Schedule = (): JSX.Element => {
  const { t } = useTranslation('app');

  useBreadcrumbs([
    {
      icon: <Svg id="schedule-outlined" width="14" height="14" />,
      label: t('schedule'),
    },
  ]);

  return <div>Schedule Component</div>;
};
