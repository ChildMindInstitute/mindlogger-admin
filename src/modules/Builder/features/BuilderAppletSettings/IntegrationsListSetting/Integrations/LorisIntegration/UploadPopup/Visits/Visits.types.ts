import { Control, FieldValues, UseFormTrigger } from 'react-hook-form';

import { CellContent } from 'shared/components';
import { LorisActivityForm, LorisUsersVisit } from 'modules/Builder/api';

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
  visitsForm: LorisUsersVisit<LorisActivityForm>[];
  handleChangeVisit: ({ userIndex, activityIndex, value }: HandleChangeVisitProps) => void;
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
