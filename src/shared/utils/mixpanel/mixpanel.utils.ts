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
  let countOfUniqueItemsInPhraseBuilders = 0;
  const phraseBuilderFieldCounts = {
    itemResponse: 0,
    sentence: 0,
    lineBreak: 0,
  };
  let autoAssignedActivityCount = 0;
  let manualAssignedActivityCount = 0;
  const itemTypes = new Set<ItemResponseType>();

  for (const activity of applet.activities) {
    if (activity.autoAssign) {
      autoAssignedActivityCount++;
    } else {
      manualAssignedActivityCount++;
    }

    const visibleItemNames = new Set<string>();
    const items = activity.items;

    for (const item of items) {
      // Hidden items are not included in any counts
      if (item.isHidden) continue;

      itemCount++;
      visibleItemNames.add(item.name);
      itemTypes.add(item.responseType);

      if (item.responseType === ItemResponseType.PhrasalTemplate) {
        phraseBuilderItemCount++;
        const referencedItemNames = new Set<string>();

        for (const phrase of item.responseValues.phrases) {
          for (const field of phrase.fields) {
            if (field.type === 'item_response') {
              if (visibleItemNames.has(field.itemName)) {
                referencedItemNames.add(field.itemName);
                phraseBuilderFieldCounts.itemResponse++;
              }
            } else if (field.type === 'sentence') {
              phraseBuilderFieldCounts.sentence++;
            } else if (field.type === 'line_break') {
              phraseBuilderFieldCounts.lineBreak++;
            }
          }
        }
        countOfUniqueItemsInPhraseBuilders += referencedItemNames.size;
      }
    }
  }

  const autoAssignedFlowCount = (applet.activityFlows ?? []).filter((f) => f.autoAssign).length;
  const manualAssignedFlowCount = (applet.activityFlows ?? []).length - autoAssignedFlowCount;

  const getPhraseBuilderAverage = (value: number) =>
    phraseBuilderItemCount ? Math.round((value / phraseBuilderItemCount) * 100) / 100 : null;

  const event: AppletSaveEvent = {
    action,
    [MixpanelProps.AppletId]: appletId,
    ...(action === MixpanelEventType.AppletSaveClick && {
      [MixpanelProps.AutoAssignedActivityCount]: autoAssignedActivityCount,
      [MixpanelProps.AutoAssignedFlowCount]: autoAssignedFlowCount,
      [MixpanelProps.ManuallyAssignedActivityCount]: manualAssignedActivityCount,
      [MixpanelProps.ManuallyAssignedFlowCount]: manualAssignedFlowCount,
    }),
    [MixpanelProps.ItemTypes]: [...itemTypes],
    [MixpanelProps.ItemCount]: itemCount,
    [MixpanelProps.PhraseBuilderItemCount]: phraseBuilderItemCount,
    [MixpanelProps.CountOfUniqueItemsInPhraseBuilders]: countOfUniqueItemsInPhraseBuilders,
    [MixpanelProps.AverageUniqueItemsPerPhraseBuilder]: getPhraseBuilderAverage(
      countOfUniqueItemsInPhraseBuilders,
    ),
    [MixpanelProps.AverageItemsPerPhraseBuilder]: getPhraseBuilderAverage(
      phraseBuilderFieldCounts.itemResponse,
    ),
    [MixpanelProps.AverageTextBoxesPerPhraseBuilder]: getPhraseBuilderAverage(
      phraseBuilderFieldCounts.sentence,
    ),
    [MixpanelProps.AverageLineBreaksPerPhraseBuilder]: getPhraseBuilderAverage(
      phraseBuilderFieldCounts.lineBreak,
    ),
  };

  if (phraseBuilderItemCount) {
    addFeatureToEvent(event, MixpanelFeature.SSI);
  }

  Mixpanel.track(event);
};
