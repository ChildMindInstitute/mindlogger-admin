import { Dispatch, SetStateAction } from 'react';

import { Encryption } from 'shared/utils';
import { AlertType } from 'shared/state';

export type NotificationProps = {
  currentId: string;
  setCurrentId: Dispatch<SetStateAction<string>>;
  alertId: string;
  label: string;
  title: string;
  message: string;
  timeAgo: string;
  viewed: boolean;
  imageSrc: string | null;
  encryption?: Encryption;
  appletId: string;
  alert: AlertType;
};
