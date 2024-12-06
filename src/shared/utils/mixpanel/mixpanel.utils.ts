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

  let itemCount = 0;
  let phraseBuilderItemCount = 0;
  let itemsIncludedInPhraseBuilders = 0;
  let autoAssignedActivityCount = 0;
  let manualAssignedActivityCount = 0;
  const itemTypes: ItemResponseType[] = [];

  for (const activity of applet.activities) {
    if (activity.autoAssign) {
      autoAssignedActivityCount++;
    } else {
      manualAssignedActivityCount++;
    }

    const referencedItemNames = new Set<string>();
    const items = activity.items;

    for (const item of items) {
      itemTypes.push(item.responseType);

      if (item.responseType === ItemResponseType.PhrasalTemplate) {
        phraseBuilderItemCount++;
        const referencedItemNames = new Set<string>();

        for (const phrase of item.responseValues.phrases) {
          for (const field of phrase.fields) {
            if (field.type === 'item_response') {
              referencedItemNames.add(field.itemName);
            }
          }
        }
        itemsIncludedInPhraseBuilders += referencedItemNames.size;
      }
    }

    itemCount += items.length;
    itemsIncludedInPhraseBuilders += referencedItemNames.size;
  }

  const uniqueItemTypes = new Set(itemTypes);

  const autoAssignedFlowCount = applet.activityFlows.filter((flow) => flow.autoAssign).length;
  const manualAssignedFlowCount = applet.activityFlows.length - autoAssignedFlowCount;

  const event: AppletSaveEvent = {
    action,
    [MixpanelProps.AppletId]: appletId,
    ...(action === MixpanelEventType.AppletSaveClick && {
      [MixpanelProps.AutoAssignedActivityCount]: autoAssignedActivityCount,
      [MixpanelProps.AutoAssignedFlowCount]: autoAssignedFlowCount,
      [MixpanelProps.ManuallyAssignedActivityCount]: manualAssignedActivityCount,
      [MixpanelProps.ManuallyAssignedFlowCount]: manualAssignedFlowCount,
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
