import { ActivityItemAnswer } from 'shared/types';
import { ActivitySettingsSubscale } from 'shared/state';
import { Version } from 'api';

import { ActivityCompletion, FormattedResponse } from '../Report.types';

export const enum SubscalesTypes {
  Table = 'Table',
}

export type SubscaleScore = {
  label: string;
  score: number;
};

export type AdditionalInformation = {
  optionText: string;
  'data-testid'?: string;
};

export type SubscalesProps = {
  answers: ActivityCompletion[];
  versions: Version[];
  subscalesFrequency: number;
};

export type ParsedSubscale = {
  score: number;
  optionText: string;
  date: Date;
  activityCompletionID?: string;
  activityItems: Record<string, ActivityItemAnswer>;
  subscalesObject: Record<string, ActivitySettingsSubscale>;
  restScores?: { [key: string]: { score: number; optionText: string } };
};

export type ParsedSubscales = {
  allSubscalesScores: {
    [key: string]: {
      activityCompletions: ParsedSubscale[];
    };
  };
  finalScores: { score: number; optionText: string; date: Date; activityCompletionID?: string }[];
  latestFinalScore: number | null;
  allSubscalesToRender: SubscaleToRender;
};

export type ActivityCompletionToRender = {
  [key: string]: {
    items?: FormattedResponse[];
    score: number;
    optionText?: string;
    restScores?: { [key: string]: { score: number; optionText: string } };
  };
};

export type SubscaleToRender = Record<
  string,
  {
    items?: FormattedResponse[];
    restScores?: { [key: string]: { score: number; optionText: string } };
  }
>;

export type Subscale = {
  items?: FormattedResponse[];
  score?: number;
  optionText?: string;
  restScores: Record<string, Subscale>;
};

export type GroupedSubscales = Record<string, Subscale>;
