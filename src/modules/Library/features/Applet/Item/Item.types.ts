import { AppletUiType, ExpandedItem } from '../Applet.types';

export type ItemProps = {
  item: ExpandedItem;
  appletId: string;
  activityName: string;
  activityKey: string;
  uiType: AppletUiType;
  search: string;
  'data-testid'?: string;
};
