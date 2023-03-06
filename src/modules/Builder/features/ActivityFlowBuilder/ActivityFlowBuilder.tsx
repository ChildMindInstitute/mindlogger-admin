import { useTranslation } from 'react-i18next';

import { Svg } from 'components';
import { StyledBuilderWrapper } from 'styles/styledComponents';
import { useBreadcrumbs } from 'hooks';

import { Header, Item } from '../../components';
import { activities, getActions, getButtons } from './ActivityFlowBuilder.const';

export const ActivityFlowBuilder = () => {
  const { t } = useTranslation('app');

  useBreadcrumbs([
    {
      icon: <Svg id="flow" width="18" height="18" />,
      label: t('activityFlowBuilder'),
    },
  ]);

  return (
    <StyledBuilderWrapper>
      <Header title={t('activityFlowBuilder')} buttons={getButtons()} />
      {activities?.map((item, i) => (
        <Item
          key={item.id}
          index={i + 1}
          total={activities.length}
          getActions={getActions}
          {...item}
        />
      ))}
    </StyledBuilderWrapper>
  );
};
