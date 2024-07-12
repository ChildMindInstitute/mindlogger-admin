import { Dispatch, SetStateAction } from 'react';
import { Control, FieldValues, UseFormTrigger } from 'react-hook-form';

import { CellContent } from 'shared/components';
import { LorisActivityForm, LorisActivityResponse, LorisUsersVisit } from 'modules/Builder/api';

import { Steps } from '../UploadDataPopup.types';

export type VisitRow = {
  activityName: CellContent;
  completedDate: CellContent;
  secretUserId: CellContent;
  lorisVisits: CellContent;
};

export type LorisVisitsProps = {
  onSetIsLoading: Dispatch<SetStateAction<boolean>>;
  setVisitsData: Dispatch<LorisUsersVisit<LorisActivityResponse>[]>;
  setStep: Dispatch<SetStateAction<Steps>>;
};

export type GetLorisActivitiesRows = {
  control: Control<FieldValues>;
  trigger: UseFormTrigger<FieldValues>;
  visitsList: string[];
  visitsForm: LorisUsersVisit<LorisActivityForm>[];
  handleChangeVisit: ({ userIndex, activityIndex, value }: HandleChangeVisitProps) => void;
};

export type UseFetchVisitsDataProps = {
  appletId?: string;
  onSetIsLoading: Dispatch<SetStateAction<boolean>>;
  setVisitsList: Dispatch<SetStateAction<string[]>>;
  setVisitsData: Dispatch<LorisUsersVisit<LorisActivityResponse>[]>;
  reset: (values?: Partial<FieldValues>) => void;
  setStep: Dispatch<SetStateAction<Steps>>;
};

export type HandleChangeVisitProps = {
  userIndex: number;
  activityIndex: number;
  value: string;
};

export type GetMatchOptionsProps = {
  visitsList?: string[];
  visits?: string[];
};
