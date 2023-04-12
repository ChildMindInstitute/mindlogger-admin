import { Dispatch, SetStateAction } from 'react';

export type SubmitAssessmentPopupProps = {
  popupVisible: boolean;
  setPopupVisible: Dispatch<SetStateAction<boolean>>;
};
