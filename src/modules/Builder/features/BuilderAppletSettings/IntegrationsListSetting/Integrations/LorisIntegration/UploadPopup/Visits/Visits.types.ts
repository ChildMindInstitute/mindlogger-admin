import { Control, FieldValues, UseFormTrigger } from 'react-hook-form';

import { CellContent } from 'shared/components';
import { LorisUserAnswerVisit } from 'modules/Builder/api';

export type VisitRow = {
  activityName: CellContent;
  completedDate: CellContent;
  secretUserId: CellContent;
  lorisVisits: CellContent;
};

export type VisitsProps = {
  visitsList: string[];
};

export type GetActivitiesRows = {
  control: Control<FieldValues>;
  trigger: UseFormTrigger<FieldValues>;
  visitsList: string[];
  visitsForm: LorisUserAnswerVisit[];
  handleChangeVisit: ({ activityAnswer, value }: HandleChangeVisitProps) => void;
};

export type HandleChangeVisitProps = {
  activityAnswer: LorisUserAnswerVisit;
  value: string;
};

export type GetMatchOptionsProps = {
  visitsList?: string[];
  visits?: string[];
};
