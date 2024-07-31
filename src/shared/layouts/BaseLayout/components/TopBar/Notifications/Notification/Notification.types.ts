import { Dispatch, SetStateAction } from 'react';

import { AlertType } from 'shared/state';

export type NotificationProps = AlertType & {
  currentId: string;
  setCurrentId: Dispatch<SetStateAction<string>>;
  timeAgo: string;
};
