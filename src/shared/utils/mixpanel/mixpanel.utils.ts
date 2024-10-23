import { SingleApplet } from 'redux/modules';
import { ItemResponseType } from 'shared/consts';

import { MixpanelPayload, MixpanelProps } from './mixpanel.types';
import { Mixpanel } from './mixpanel';

export const trackAppletSave = ({
  action,
  applet,
  appletId = applet?.id,
  payload,
}: {
  action: string;
  applet?: Pick<SingleApplet, 'id' | 'activities'>;
  appletId?: string;
  payload?: MixpanelPayload;
}) => {
  if (!applet) return;

  const itemTypes: ItemResponseType[] = [];
  (applet.activities ?? []).forEach((activity) => {
    itemTypes.push(...(activity.items ?? []).map((item) => item.responseType));
  });
  const uniqueItemTypes = new Set(itemTypes);

  const props: MixpanelPayload = {
    [MixpanelProps.AppletId]: appletId,
    [MixpanelProps.ItemTypes]: [...uniqueItemTypes],
    ...payload,
  };

  if (uniqueItemTypes.has(ItemResponseType.PhrasalTemplate)) {
    props[MixpanelProps.Feature] = 'SSI';
  }

  Mixpanel.track(action, props);
};
