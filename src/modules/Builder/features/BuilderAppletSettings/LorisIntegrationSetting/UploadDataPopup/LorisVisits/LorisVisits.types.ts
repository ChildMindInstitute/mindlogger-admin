import { Dispatch, SetStateAction } from 'react';

import { Steps } from '../UploadDataPopup.types';

export type VisitRowPayload = {
  content: () => JSX.Element;
  value: string;
};

export type VisitRow = {
  activityName: VisitRowPayload;
  completedDate: VisitRowPayload;
  secretUserId: VisitRowPayload;
  lorisVisits: VisitRowPayload;
}[];

export type LorisVisitsProps = {
  onSetIsLoading: Dispatch<SetStateAction<boolean>>;
  setStep: Dispatch<SetStateAction<Steps>>;
};
