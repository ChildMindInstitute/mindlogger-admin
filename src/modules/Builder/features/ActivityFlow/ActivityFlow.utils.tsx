import { v4 as uuidv4 } from 'uuid';

import { Svg } from 'shared/components';
import { ActivityFlowFormValues } from 'modules/Builder/types';

import { GetActivityFlowActions } from './ActivityFlow.types';

export const getFlowsItemActions = ({
  activityFlowIndex,
  activityFlowId,
  activityFlowHidden,
  removeActivityFlow,
  editActivityFlow,
  duplicateActivityFlow,
  toggleActivityFlowVisibility,
}: GetActivityFlowActions) => [
  {
    icon: <Svg id="edit" />,
    action: () => editActivityFlow(activityFlowId),
  },
  {
    icon: <Svg id="duplicate" />,
    action: () => duplicateActivityFlow(activityFlowIndex),
  },
  {
    icon: <Svg id={activityFlowHidden ? 'visibility-off' : 'visibility-on'} />,
    action: () => toggleActivityFlowVisibility(activityFlowIndex),
    isStatic: activityFlowHidden,
  },
  {
    icon: <Svg id="trash" />,
    action: removeActivityFlow,
  },
];

export const getActivityFlowKey = (flow: ActivityFlowFormValues) => flow.id ?? flow.key ?? '';

export const getDuplicatedActivityFlow = (flow: ActivityFlowFormValues, name: string) => {
  const duplicatedItems =
    flow.items?.map((item) => ({
      ...item,
      id: undefined,
      key: uuidv4(),
    })) ?? [];

  return {
    ...flow,
    items: duplicatedItems,
    id: undefined,
    key: uuidv4(),
    name,
  };
};
