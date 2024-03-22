import { Version } from 'api';
import {
  Answer,
  SimpleAnswerValue,
} from 'modules/Dashboard/features/RespondentData/RespondentDataSummary/Report/Report.types';

export type TimePickerLineChartProps = {
  color: string;
  minDate: Date;
  maxDate: Date;
  answers: Answer<SimpleAnswerValue>[];
  versions: Version[];
  'data-testid'?: string;
};

export type TimePickerDataPointRaw = {
  x: Date;
  y: Date;
};

export type DataProps = {
  answers: Answer<SimpleAnswerValue>[];
  versions: Version[];
  color: string;
};
