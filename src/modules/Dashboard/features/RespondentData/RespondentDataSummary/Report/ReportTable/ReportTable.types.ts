import {
  Answer,
  RespondentAnswerValue,
  SimpleAnswerValue,
  TimeRangeAnswerValue,
} from 'modules/Dashboard/features/RespondentData/RespondentData.types';
import { ItemResponseType } from 'shared/consts';

export type TextItemAnswer = {
  date: string;
  time: string;
  answer: SimpleAnswerValue;
};

export type TimeRangeItemAnswer = {
  date: string;
  time: string;
} & TimeRangeAnswerValue;

export type FormattedAnswers = TextItemAnswer | TimeRangeItemAnswer;

export type TextAnswer = {
  answer: string;
  date: string;
};

export type ReportTableProps = {
  responseType: ItemResponseType;
  answers?: Answer<RespondentAnswerValue>[];
  'data-testid'?: string;
};
