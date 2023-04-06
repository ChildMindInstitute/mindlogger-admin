import { useTranslation } from 'react-i18next';

import { BuilderContainer } from 'shared/features';
import { useBreadcrumbs } from 'shared/hooks';

import { Item } from '../../components';
import { activities, getActions } from './ActivityFlowBuilder.const';
import { ActivityFlowBuilderHeader } from './ActivityFlowBuilderHeader';

export const ActivityFlowBuilder = () => {
  const { t } = useTranslation('app');

  useBreadcrumbs([
    {
      icon: 'flow',
      label: t('activityFlowBuilder'),
    },
  ]);

  return (
    <BuilderContainer Header={ActivityFlowBuilderHeader} title={t('activityFlowBuilder')}>
      {activities?.map((item, i) => (
        <Item
          key={item.id}
          index={i + 1}
          total={activities.length}
          getActions={getActions}
          {...item}
        />
      ))}
    </BuilderContainer>
  );
};
