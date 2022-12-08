import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';

import { Svg } from 'components/Svg';
import { breadcrumbs } from 'redux/modules';
import { useAppDispatch } from 'redux/store';
import { useBaseBreadcrumbs } from 'hooks';

export const Schedule = (): JSX.Element => {
  const { id } = useParams();
  const { t } = useTranslation('app');
  const dispatch = useAppDispatch();
  const baseBreadcrumbs = useBaseBreadcrumbs();

  useEffect(() => {
    if (id && baseBreadcrumbs?.length > 0) {
      dispatch(
        breadcrumbs.actions.setBreadcrumbs([
          ...baseBreadcrumbs,
          {
            icon: <Svg id="schedule-outlined" width="14" height="14" />,
            label: t('schedule'),
          },
        ]),
      );
    }
  }, [baseBreadcrumbs, id, dispatch, t]);

  return <div>Schedule Component</div>;
};
