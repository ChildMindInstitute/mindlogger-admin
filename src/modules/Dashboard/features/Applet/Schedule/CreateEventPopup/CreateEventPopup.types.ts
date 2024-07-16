import { Dispatch, SetStateAction } from 'react';

export type CreateEventPopupProps = {
  open: boolean;
  setCreateEventPopupVisible: Dispatch<SetStateAction<boolean>>;
  defaultStartDate: Date;
  userId?: string;
  'data-testid'?: string;
};
