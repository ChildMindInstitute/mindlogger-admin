import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';

import { Svg } from 'components/Svg';
import { useBreadcrumbs } from 'hooks';

export const Schedule = (): JSX.Element => {
  const { id } = useParams();
  const { t } = useTranslation('app');

  useBreadcrumbs(
    id
      ? [
          {
            icon: <Svg id="schedule-outlined" width="14" height="14" />,
            label: t('schedule'),
          },
        ]
      : undefined,
  );

  return <div>Schedule Component</div>;
};
