import { PublishedActivity } from 'redux/modules';

import { AppletUiType } from '../Applet.types';

export type ActivityProps = {
  appletId: string;
  activity: PublishedActivity;
  uiType: AppletUiType;
  'data-testid'?: string;
};
