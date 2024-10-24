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

  const itemTypes: ItemResponseType[] = [];
  (applet.activities ?? []).forEach((activity) => {
    itemTypes.push(...(activity.items ?? []).map((item) => item.responseType));
  });
  const uniqueItemTypes = new Set(itemTypes);

  const event: AppletSaveEvent = {
    action,
    [MixpanelProps.AppletId]: appletId,
    [MixpanelProps.ItemTypes]: [...uniqueItemTypes],
  };

  if (uniqueItemTypes.has(ItemResponseType.PhrasalTemplate)) {
    addFeatureToEvent(event, MixpanelFeature.SSI);
  }

  Mixpanel.track(event);
};
