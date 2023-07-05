import { Version } from '../Charts/LineChart/LineChart.types';
import { ActivityCompletion } from '../Report.types';

export const enum SubscalesTypes {
  Table = 'Table',
}

export type SubscaleScore = {
  label: string;
  score: number;
};

export type AdditionalInformation = {
  description?: string;
};

export type Subscale = {
  id: string;
  type?: SubscalesTypes;
  name?: string;
  items?: Subscale[];
  additionalInformation?: AdditionalInformation;
};

export type SubscalesProps = {
  answers: ActivityCompletion[];
};

export type ParsedSubscale = {
  score: number;
  optionText: string;
  date: Date;
  activityCompletionID?: string;
};

export type ParsedSubscales = {
  allSubscalesScores: {
    [key: string]: {
      activityCompletions: ParsedSubscale[];
    };
  };
  finalScores: ParsedSubscale[];
  latestFinalScore: number | null;
  versions: Version[];
};
