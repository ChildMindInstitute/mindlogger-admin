import { Dispatch, SetStateAction } from 'react';

import { LorisActivityForm, LorisUsersVisit } from 'modules/Builder/api';

export type UploadPopupProps = {
  open: boolean;
  onClose: () => void;
};

export enum UploadSteps {
  CurrentConnectionInfo,
  SelectVisits,
  EmptyState,
  Success,
  Error,
}

export type GetScreensProps = {
  visitsList: string[];
  onClose: () => void;
  setStep: Dispatch<SetStateAction<UploadSteps>>;
  handleNextClick: () => void;
  handleSubmitVisits: () => void;
};

export type UploadDataForm = {
  visitsForm: LorisUsersVisit<LorisActivityForm>[];
};
