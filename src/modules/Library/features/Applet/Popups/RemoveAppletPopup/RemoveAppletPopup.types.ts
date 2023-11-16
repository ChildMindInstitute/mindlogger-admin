import { Dispatch, SetStateAction } from 'react';

import { PublishedApplet } from 'modules/Library/state';

export type RemoveAppletPopupProps = {
  removeAppletPopupVisible: boolean;
  setRemoveAppletPopupVisible: Dispatch<SetStateAction<boolean>>;
  appletId: string;
  appletName: string;
  isAuthorized: boolean;
  cartItems: PublishedApplet[] | null;
  'data-testid'?: string;
};
