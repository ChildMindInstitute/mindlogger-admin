import {
  TextAnswer,
  TimeRangeAnswer,
  TimeRangeAnswerValue,
} from 'modules/Dashboard/features/RespondentData/RespondentData.types';
import { ItemResponseType } from 'shared/consts';

export type TextItemAnswer = {
  date: string;
  time: string;
  answer: string;
};

export type TimeRangeItemAnswer = {
  date: string;
  time: string;
} & TimeRangeAnswerValue;

export type FormattedAnswers = TextItemAnswer | TimeRangeItemAnswer;

export type ReportTableProps = {
  responseType: ItemResponseType;
  answers?: (TimeRangeAnswer | TextAnswer)[];
  'data-testid'?: string;
};
