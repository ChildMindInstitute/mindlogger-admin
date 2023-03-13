import { Dispatch, SetStateAction } from 'react';

export type EditActivityPopupProps = {
  open: boolean;
  activityName: string;
  setEditActivityPopupVisible: Dispatch<SetStateAction<boolean>>;
};
