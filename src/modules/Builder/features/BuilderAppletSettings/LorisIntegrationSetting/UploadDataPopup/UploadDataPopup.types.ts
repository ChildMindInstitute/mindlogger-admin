import { Dispatch, SetStateAction } from 'react';

import { LorisActivityForm, LorisActivityResponse, LorisUsersVisit } from 'modules/Builder/api';

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
  visitsData: LorisUsersVisit<LorisActivityResponse>[];
  setVisitsData: Dispatch<LorisUsersVisit<LorisActivityResponse>[]>;
  setStep: Dispatch<SetStateAction<Steps>>;
};

export type UploadDataForm = {
  visitsForm: LorisUsersVisit<LorisActivityForm>[];
};
