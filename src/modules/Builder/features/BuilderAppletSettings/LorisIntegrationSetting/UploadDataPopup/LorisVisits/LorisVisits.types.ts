import { Dispatch, SetStateAction } from 'react';
import { Control, FieldValues } from 'react-hook-form';

import { LorisUsersVisit } from 'modules/Builder/api';

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
};

export type LorisVisitsProps = {
  onSetIsLoading: Dispatch<SetStateAction<boolean>>;
  setStep: Dispatch<SetStateAction<Steps>>;
};

export type GetLorisActivitiesRows = {
  control: Control<FieldValues>;
  visitsList: string[];
  usersVisits: LorisUsersVisit[];
};
