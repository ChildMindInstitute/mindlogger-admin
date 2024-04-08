import { Version } from 'api';
import { TimeAnswer } from 'modules/Dashboard/features/RespondentData/RespondentData.types';

export type TimePickerLineChartProps = {
  color: string;
  minDate: Date;
  maxDate: Date;
  answers: TimeAnswer[];
  versions: Version[];
  'data-testid'?: string;
};

export type TimePickerDataPointRaw = {
  x: Date;
  y: Date;
};

export type DataProps = {
  answers: TimeAnswer[];
  versions: Version[];
  color: string;
};
