import { AppletUiType, ExpandedActivity } from '../Applet.types';

export type ActivityProps = {
  appletId: string;
  activity: ExpandedActivity;
  uiType: AppletUiType;
  search: string;
  'data-testid'?: string;
};
