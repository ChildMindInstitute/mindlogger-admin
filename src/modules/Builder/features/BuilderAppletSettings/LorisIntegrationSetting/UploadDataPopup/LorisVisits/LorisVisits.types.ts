import { Dispatch, SetStateAction } from 'react';
import { Control, FieldValues, UseFormTrigger } from 'react-hook-form';

import { LorisUsersVisit } from 'modules/Builder/api';
import { CellContent } from 'shared/components';

import { Steps } from '../UploadDataPopup.types';

export type VisitRow = {
  activityName: CellContent;
  completedDate: CellContent;
  secretUserId: CellContent;
  lorisVisits: CellContent;
};

export type LorisVisitsProps = {
  onSetIsLoading: Dispatch<SetStateAction<boolean>>;
  setStep: Dispatch<SetStateAction<Steps>>;
};

export type GetLorisActivitiesRows = {
  control: Control<FieldValues>;
  trigger: UseFormTrigger<FieldValues>;
  visitsList: string[];
  usersVisits: LorisUsersVisit[];
};
