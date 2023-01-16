import { Dispatch, SetStateAction } from 'react';

import { Encryption } from 'redux/modules';
import { AppletPasswordForm } from 'features/Applet/AppletPassword/AppletPassword.types';

export type EnterAppletPasswordProps = {
  popupVisible: boolean;
  setPopupVisible: Dispatch<SetStateAction<boolean>>;
  appletId?: string;
  encryption?: Encryption;
  submitCallback?: (formValue: AppletPasswordForm) => void;
};
