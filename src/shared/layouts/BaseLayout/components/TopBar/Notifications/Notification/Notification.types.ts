import { Dispatch, SetStateAction } from 'react';

import { Encryption } from 'shared/utils';
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
  respondentId: string;
  encryption: Encryption;
  alert: AlertType;
};
