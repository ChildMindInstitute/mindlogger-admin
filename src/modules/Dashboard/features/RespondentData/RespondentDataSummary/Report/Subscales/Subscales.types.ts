import { AnswerDTO } from 'shared/types';
import { ActivitySettingsSubscale, Item } from 'shared/state';

import { Version } from '../Charts/LineChart/LineChart.types';
import { ActivityCompletion, FormattedResponse } from '../Report.types';

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
  activityItems: Record<string, { answer: AnswerDTO; activityItem: Item }>;
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
  versions: Version[];
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

//TODO: fix type

export type SubscaleToRender = {
  [key: string]: { items?: any };
};
