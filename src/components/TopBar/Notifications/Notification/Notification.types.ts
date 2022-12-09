import { Dispatch, SetStateAction } from 'react';

import { Encryption } from 'redux/modules';

export type NotificationProps = {
  currentId: string;
  setCurrentId: Dispatch<SetStateAction<string>>;
  accountId: string;
  alertId: string;
  label: string;
  title: string;
  message: string;
  timeAgo: string;
  viewed: boolean;
  imageSrc: string | null;
  encryption?: Encryption;
};
