import { MutableRefObject } from 'react';

import { AppletPasswordRef } from 'shared/components';
import { Encryption } from 'shared/utils';

export enum AppletPasswordPopupType {
  Create = 'create',
  Enter = 'enter',
}

export type AppletPasswordPopupProps = {
  popupType?: AppletPasswordPopupType;
  popupVisible: boolean;
  onClose: () => void;
  appletId: string;
  encryption?: Encryption | null;
  submitCallback?: (
    encryption: Encryption,
    ref: MutableRefObject<AppletPasswordRef | null>,
  ) => void;
};
