import { Dispatch, SetStateAction } from 'react';

import { AlertType } from 'shared/state';
import { Encryption } from 'shared/utils/encryption';

export type NotificationProps = {
  currentId: string;
  setCurrentId: Dispatch<SetStateAction<string>>;
  id: string;
  workspace: string;
  appletId: string;
  appletName: string;
  image: string;
  secretId: string;
  message: string;
  timeAgo: string;
  isWatched: boolean;
  respondentId: string;
  encryption: Encryption;
  alert: AlertType;
};
