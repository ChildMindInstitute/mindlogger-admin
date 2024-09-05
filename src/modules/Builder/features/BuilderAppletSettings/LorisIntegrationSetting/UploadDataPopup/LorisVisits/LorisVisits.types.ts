import { Dispatch, SetStateAction } from 'react';
import { Control, FieldValues, UseFormTrigger } from 'react-hook-form';

import { CellContent } from 'shared/components';
import { LorisUserAnswerVisit } from 'modules/Builder/api';

import { Steps } from '../UploadDataPopup.types';

export type VisitRow = {
  activityName: CellContent;
  completedDate: CellContent;
  secretUserId: CellContent;
  lorisVisits: CellContent;
};

export type LorisVisitsProps = {
  onSetIsLoading: Dispatch<SetStateAction<boolean>>;
  setVisitsData: Dispatch<LorisUserAnswerVisit[]>;
  setStep: Dispatch<SetStateAction<Steps>>;
};

export type GetLorisActivitiesRows = {
  control: Control<FieldValues>;
  trigger: UseFormTrigger<FieldValues>;
  visitsList: string[];
  visitsForm: LorisUserAnswerVisit[];
  handleChangeVisit: ({ activityAnswer, value }: HandleChangeVisitProps) => void;
};

export type UseFetchVisitsDataProps = {
  appletId?: string;
  onSetIsLoading: Dispatch<SetStateAction<boolean>>;
  setVisitsList: Dispatch<SetStateAction<string[]>>;
  setVisitsData: Dispatch<LorisUserAnswerVisit[]>;
  reset: (values?: Partial<FieldValues>) => void;
  setStep: Dispatch<SetStateAction<Steps>>;
};

export type HandleChangeVisitProps = {
  activityAnswer: LorisUserAnswerVisit;
  value: string;
};

export type GetMatchOptionsProps = {
  visitsList?: string[];
  visits?: string[];
};
