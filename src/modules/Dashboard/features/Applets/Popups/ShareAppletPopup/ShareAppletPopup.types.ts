import { Dispatch, SetStateAction } from 'react';

import { Applet } from 'api';

export type ShareAppletPopupProps = {
  sharePopupVisible: boolean;
  setSharePopupVisible: Dispatch<SetStateAction<boolean>>;
  applet: Applet;
};
