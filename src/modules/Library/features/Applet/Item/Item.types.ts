import { Item } from 'shared/state';

import { AppletUiType } from '../Applet.types';

export type ItemProps = {
  item: Item;
  appletId: string;
  activityName: string;
  activityKey: string;
  uiType: AppletUiType;
  search: string;
};
