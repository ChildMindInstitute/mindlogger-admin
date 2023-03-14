import { Dispatch, SetStateAction } from 'react';

export type CreateActivityPopupProps = {
  open: boolean;
  activityName: string;
  setCreateActivityPopupVisible: Dispatch<SetStateAction<boolean>>;
};
