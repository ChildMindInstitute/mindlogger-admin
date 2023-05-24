import { ItemAnswer } from '../Report.types';

export type TextItemAnswer = {
  date: string;
  time: string;
  response: string;
};

export type ReportTableProps = {
  answers?: ItemAnswer[];
};
