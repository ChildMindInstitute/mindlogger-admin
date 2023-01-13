import { Dispatch, SetStateAction } from 'react';

export type SelectRespondentsPopupProps = {
  selectRespondentsPopupVisible: boolean;
  setSelectRespondentsPopupVisible: Dispatch<SetStateAction<boolean>>;
};
