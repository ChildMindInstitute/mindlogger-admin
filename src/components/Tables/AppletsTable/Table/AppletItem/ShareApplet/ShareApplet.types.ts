import { Dispatch, SetStateAction } from 'react';

import { FolderApplet } from 'redux/modules';

export type ShareAppletData = {
  appletName: string;
  keywords: string[];
  keyword: string;
  checked: boolean;
};

export type ShareAppletProps = {
  sharePopupVisible: boolean;
  setSharePopupVisible: Dispatch<SetStateAction<boolean>>;
  applet: FolderApplet;
};
