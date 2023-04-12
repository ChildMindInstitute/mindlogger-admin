import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useFieldArray, useFormContext } from 'react-hook-form';
import { generatePath, useNavigate, useParams } from 'react-router-dom';
import uniqueId from 'lodash.uniqueid';

import { BuilderContainer } from 'shared/features';
import { useBreadcrumbs } from 'shared/hooks';
import { Item, ItemUiType } from 'modules/Builder/components';
import {
  ActivityFlowFormValues,
  AppletFormValues,
} from 'modules/Builder/pages/BuilderApplet/BuilderApplet.types';
import { page } from 'resources';

import { getFlowBuilderActions } from './ActivityFlowBuilder.utils';
import { ActivityFlowBuilderHeader } from './ActivityFlowBuilderHeader';

export const ActivityFlowBuilder = () => {
  const { t } = useTranslation('app');
  const navigate = useNavigate();
  const { control, watch } = useFormContext();
  const { appletId, activityFlowId } = useParams();
  const activityFlows: AppletFormValues['activityFlows'] = watch('activityFlows');
  const activityFlowIndex = activityFlows.findIndex((flow) => flow.id === activityFlowId);
  const { replace } = useFieldArray({
    control,
    name: `activityFlows.${activityFlowIndex}.items`,
  });
  const activityFlowItems: ActivityFlowFormValues['items'] = watch(
    `activityFlows.${activityFlowIndex}.items`,
  );
  const activities: AppletFormValues['activities'] = watch('activities');

  useBreadcrumbs([
    {
      icon: 'flow',
      label: t('activityFlowBuilder'),
    },
  ]);

  useEffect(() => {
    const flowItems = activities.map((activity) => ({ activityKey: activity.key }));
    replace(flowItems);
  }, [activities]);

  useEffect(() => {
    if (activityFlowIndex !== -1) return;
    navigate(
      generatePath(page.builderAppletActivityFlow, {
        appletId,
      }),
    );
  }, [activityFlowIndex]);

  return (
    <BuilderContainer Header={ActivityFlowBuilderHeader} title={t('activityFlowBuilder')}>
      {activityFlowItems?.map((item, index) => {
        const activityKey = item['activityKey'];
        const currentActivity = activities?.find((activity) => activity.key === activityKey);
        const activityName = currentActivity?.name;
        const activityDescription = currentActivity?.description;

        return (
          <Item
            key={uniqueId()}
            index={index + 1}
            total={activities.length}
            getActions={getFlowBuilderActions}
            uiType={ItemUiType.FlowBuilder}
            name={activityName || ''}
            description={activityDescription || ''}
            {...item}
          />
        );
      })}
    </BuilderContainer>
  );
};
