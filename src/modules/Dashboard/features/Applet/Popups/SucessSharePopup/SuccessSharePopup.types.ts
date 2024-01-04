import { Dispatch, SetStateAction } from 'react';

import { SingleApplet } from 'shared/state';

export type SuccessSharePopupProps = {
  applet: SingleApplet;
  keywords: string[];
  libraryUrl: string;
  sharePopupVisible: boolean;
  setSharePopupVisible: Dispatch<SetStateAction<boolean>>;
  'data-testid'?: string;
};
