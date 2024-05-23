import { Dispatch, SetStateAction } from 'react';

import { Encryption } from 'shared/utils/encryption';
import { AlertType } from 'shared/state';

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
  subjectId: string;
  encryption: Encryption;
  alert: AlertType;
};
