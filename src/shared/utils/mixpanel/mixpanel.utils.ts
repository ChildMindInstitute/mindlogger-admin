import { SingleApplet } from 'redux/modules';
import { ItemResponseType } from 'shared/consts';

import {
  AppletSaveEvent,
  MixpanelAppletSaveEventType,
  MixpanelEventType,
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

  let itemCount: number = 0;
  let phraseBuilderItemCount: number = 0;
  let itemsIncludedInPhraseBuilders: number = 0;
  let autoAssignedActivityCount = 0;
  let manualAssignedActivityCount = 0;
  const itemTypes: ItemResponseType[] = [];

  for (const activity of applet.activities ?? []) {
    itemTypes.push(...(activity.items ?? []).map((item) => item.responseType));
    if (activity.autoAssign) {
      autoAssignedActivityCount++;
    } else {
      manualAssignedActivityCount++;
    }
  }

  (applet.activities ?? []).forEach((activity) => {
    const referencedItemNames = new Set<string>();
    const items = activity.items ?? [];

    for (const item of items) {
      itemTypes.push(item.responseType);

      if (item.responseType === ItemResponseType.PhrasalTemplate) {
        phraseBuilderItemCount++;

        for (const phrase of item.responseValues.phrases) {
          for (const field of phrase.fields) {
            if (field.type === 'item_response') {
              referencedItemNames.add(field.itemName);
            }
          }
        }
      }
    }

    itemCount += items.length;
    itemsIncludedInPhraseBuilders += referencedItemNames.size;
  });

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
    ...(action === MixpanelEventType.AppletSaveClick && {
      [MixpanelProps.AutoAssignedActivityCount]: autoAssignedActivityCount,
      [MixpanelProps.AutoAssignedFlowCount]: autoAssignedActivityFlowCount,
      [MixpanelProps.ManuallyAssignedActivityCount]: manualAssignedActivityCount,
      [MixpanelProps.ManuallyAssignedFlowCount]: manualAssignedActivityFlowCount,
    }),
    [MixpanelProps.ItemTypes]: [...uniqueItemTypes],
    [MixpanelProps.ItemCount]: itemCount,
    [MixpanelProps.PhraseBuilderItemCount]: phraseBuilderItemCount,
    [MixpanelProps.ItemsIncludedInPhraseBuilders]: itemsIncludedInPhraseBuilders,
    [MixpanelProps.AverageItemsPerPhraseBuilder]: phraseBuilderItemCount
      ? itemsIncludedInPhraseBuilders / phraseBuilderItemCount
      : null,
  };

  if (phraseBuilderItemCount) {
    addFeatureToEvent(event, MixpanelFeature.SSI);
  }

  Mixpanel.track(event);
};
