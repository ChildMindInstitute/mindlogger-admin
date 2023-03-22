import { Dispatch, SetStateAction } from 'react';

export type CreateActivityPopupProps = {
  open: boolean;
  setCreateActivityPopupVisible: Dispatch<SetStateAction<boolean>>;
  defaultStartDate: Date;
};
