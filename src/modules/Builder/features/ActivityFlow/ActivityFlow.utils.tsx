import { Svg } from 'shared/components';

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
    toolTipTitle: '',
  },
  {
    icon: <Svg id="duplicate" />,
    action: () => duplicateActivityFlow(activityFlowIndex),
    toolTipTitle: '',
  },
  {
    icon: <Svg id={activityFlowHidden ? 'visibility-off' : 'visibility-on'} />,
    action: () => toggleActivityFlowVisibility(activityFlowIndex),
    toolTipTitle: '',
    isStatic: true,
  },
  {
    icon: <Svg id="trash" />,
    action: removeActivityFlow,
    toolTipTitle: '',
  },
  {
    icon: <Svg id="drag" />,
    action: () => null,
    toolTipTitle: '',
  },
];
