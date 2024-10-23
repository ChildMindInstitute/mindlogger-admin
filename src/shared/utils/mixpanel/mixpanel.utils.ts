import { SingleApplet } from 'redux/modules';
import { ItemResponseType } from 'shared/consts';

import { AppletSaveEvent, MixpanelAppletSaveEventType, MixpanelProps } from './mixpanel.types';
import { Mixpanel } from './mixpanel';

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
    event[MixpanelProps.Feature] = 'SSI';
  }

  Mixpanel.track(event);
};
