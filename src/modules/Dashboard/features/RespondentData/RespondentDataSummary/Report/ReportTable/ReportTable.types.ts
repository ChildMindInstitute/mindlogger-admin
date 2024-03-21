import { Answer } from 'modules/Dashboard/features/RespondentData/RespondentData.types';

export type TextItemAnswer = {
  date: string;
  time: string;
  answer: string | number;
};

export type TextAnswer = {
  answer: string;
  date: string;
};

export type ReportTableProps = {
  answers?: Answer[];
  'data-testid'?: string;
};
