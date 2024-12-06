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
  applet?: Pick<SingleApplet, 'id' | 'activities'>;
  appletId?: string;
}) => {
  if (!applet) return;

  let itemCount: number = 0;
  let phraseBuilderItemCount: number = 0;
  let itemsIncludedInPhraseBuilders: number = 0;
  const itemTypes: ItemResponseType[] = [];

  (applet.activities ?? []).forEach((activity) => {
    const items = activity.items ?? [];

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
  });
  const uniqueItemTypes = new Set(itemTypes);

  const event: AppletSaveEvent = {
    action,
    [MixpanelProps.AppletId]: appletId,
    [MixpanelProps.ItemTypes]: [...uniqueItemTypes],
    [MixpanelProps.ItemCount]: itemCount,
    [MixpanelProps.PhraseBuilderItemCount]: phraseBuilderItemCount,
    [MixpanelProps.ItemsIncludedInPhraseBuilders]: itemsIncludedInPhraseBuilders,
    [MixpanelProps.AverageItemsPerPhraseBuilder]: phraseBuilderItemCount
      ? Math.round((itemsIncludedInPhraseBuilders / phraseBuilderItemCount) * 100) / 100
      : null,
  };

  if (phraseBuilderItemCount) {
    addFeatureToEvent(event, MixpanelFeature.SSI);
  }

  Mixpanel.track(event);
};
