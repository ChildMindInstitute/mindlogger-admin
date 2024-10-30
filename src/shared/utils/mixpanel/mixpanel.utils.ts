import { SingleApplet } from 'redux/modules';
import { ItemResponseType } from 'shared/consts';

import {
  AppletSaveEvent,
  MixpanelAppletSaveEventType,
  MixpanelFeature,
  MixpanelProps,
  WithFeature,
} from './mixpanel.types';
import { Mixpanel } from './mixpanel';

export const addFeatureToEvent = (event: WithFeature, feature: MixpanelFeature) => {
  const features = event[MixpanelProps.Feature] ?? [];
  event[MixpanelProps.Feature] = [...features, feature];
};

export const trackAppletSave = ({
  action,
  applet,
  appletId = applet?.id,
}: {
  action: MixpanelAppletSaveEventType;
  applet?: Pick<SingleApplet, 'id' | 'activities' | 'activityFlows'>;
  appletId?: string;
}) => {
  if (!applet) return;

  const itemTypes: ItemResponseType[] = [];
  let autoAssignedActivityCount = 0;
  let manualAssignedActivityCount = 0;
  for (const activity of applet.activities ?? []) {
    itemTypes.push(...(activity.items ?? []).map((item) => item.responseType));
    if (activity.autoAssign) {
      autoAssignedActivityCount++;
    } else {
      manualAssignedActivityCount++;
    }
  }
  const uniqueItemTypes = new Set(itemTypes);

  const autoAssignedActivityFlowCount = (applet.activityFlows ?? []).filter(
    (flow) => flow.autoAssign,
  ).length;
  const manualAssignedActivityFlowCount =
    autoAssignedActivityFlowCount === 0
      ? 0
      : applet.activityFlows.length - autoAssignedActivityFlowCount;

  const event: AppletSaveEvent = {
    action,
    [MixpanelProps.AppletId]: appletId,
    [MixpanelProps.ItemTypes]: [...uniqueItemTypes],
    [MixpanelProps.AutoAssignedActivityCount]: autoAssignedActivityCount,
    [MixpanelProps.AutoAssignedFlowCount]: autoAssignedActivityFlowCount,
    [MixpanelProps.ManuallyAssignedActivityCount]: manualAssignedActivityCount,
    [MixpanelProps.ManuallyAssignedFlowCount]: manualAssignedActivityFlowCount,
  };

  if (uniqueItemTypes.has(ItemResponseType.PhrasalTemplate)) {
    addFeatureToEvent(event, MixpanelFeature.SSI);
  }

  Mixpanel.track(event);
};
