import { Version } from 'api';
import { Answer } from 'modules/Dashboard/features/RespondentData/RespondentData.types';

export type TimePickerLineChartProps = {
  color: string;
  minDate: Date;
  maxDate: Date;
  answers: Answer[];
  versions: Version[];
  'data-testid'?: string;
};

export type TimePickerDataPointRaw = {
  x: Date;
  y: Date;
};

export type DataProps = {
  answers: Answer[];
  versions: Version[];
  color: string;
};
