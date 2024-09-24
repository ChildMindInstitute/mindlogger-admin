import { Dispatch, SetStateAction } from 'react';

import { LorisUserAnswerVisit } from 'modules/Builder/api';

export type UploadDataPopupProps = {
  open: boolean;
  onClose: () => void;
  'data-testid'?: string;
};

export enum Steps {
  Agreement,
  Visits,
  Success,
  Error,
}

export type ScreenParams = {
  handleAcceptAgreement: () => void;
  onClose: () => void;
  onSubmitVisits: () => void;
  setIsLoading: Dispatch<SetStateAction<boolean>>;
  visitsData: LorisUserAnswerVisit[];
  setVisitsData: Dispatch<LorisUserAnswerVisit[]>;
  setStep: Dispatch<SetStateAction<Steps>>;
};

export type UploadDataForm = {
  visitsForm: LorisUserAnswerVisit[];
};
