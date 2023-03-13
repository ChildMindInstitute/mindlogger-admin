import { Dispatch, SetStateAction } from 'react';

import { FolderApplet } from 'redux/modules';

export type SuccessSharePopupProps = {
  applet: FolderApplet;
  keywords: string[];
  libraryUrl: string;
  sharePopupVisible: boolean;
  setSharePopupVisible: Dispatch<SetStateAction<boolean>>;
};
