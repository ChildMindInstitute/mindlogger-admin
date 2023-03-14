import { Dispatch, SetStateAction } from 'react';

import { FolderApplet } from 'redux/modules';

export type ShareAppletPopupProps = {
  sharePopupVisible: boolean;
  setSharePopupVisible: Dispatch<SetStateAction<boolean>>;
  applet: FolderApplet;
};
