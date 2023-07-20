import { AnswerDTO } from 'shared/types';
import { ActivitySettingsSubscale, Item } from 'shared/state';
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
};

export type SubscalesProps = {
  answers: ActivityCompletion[];
  versions: Version[];
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

export type SubscaleToRender = {
  [key: string]: {
    items?: FormattedResponse[];
    restScores?: { [key: string]: { score: number; optionText: string } };
  };
};

export type Subscale = {
  items?: FormattedResponse[];
  score?: number;
  optionText?: string;
  restScores: {
    [key: string]: Subscale;
  };
};

export type GroupedSubscales = {
  [key: string]: Subscale;
};
