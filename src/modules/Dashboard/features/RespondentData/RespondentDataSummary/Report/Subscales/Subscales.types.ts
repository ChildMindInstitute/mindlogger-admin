import { ActivityItemAnswer } from 'shared/types';
import { ActivitySettingsSubscale } from 'shared/state';
import { Version } from 'modules/Dashboard/api';
import {
  ActivityCompletion,
  SingleMultiSelectionSliderFormattedResponses,
} from 'modules/Dashboard/features/RespondentData/RespondentData.types';

export const enum SubscalesTypes {
  Table = 'Table',
}

export type LabeledSubscaleScore = {
  label: string;
  score: number;
};

export type AdditionalInformation = {
  optionText: string;
  severity?: string | null;
  'data-testid'?: string;
};

export type SubscalesProps = {
  answers: ActivityCompletion[];
  versions: Version[];
  subscalesFrequency: number;
  flowResponsesIndex?: number;
};

export type CalculatedSubscaleScore = {
  score: number;
  optionText: string;
  severity?: string | null;
};

export type CalculatedSubscaleScores = {
  [subscaleName: string]: CalculatedSubscaleScore;
};

export type ParsedSubscale = {
  score: number;
  optionText: string;
  severity?: string | null;
  date: Date;
  activityCompletionID?: string;
  activityItems: Record<string, ActivityItemAnswer>;
  subscalesObject: Record<string, ActivitySettingsSubscale>;
  restScores?: CalculatedSubscaleScores;
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
    items?: SingleMultiSelectionSliderFormattedResponses[];
    score: number;
    optionText?: string;
    severity?: string | null;
    restScores?: CalculatedSubscaleScores;
  };
};

export type SubscaleToRender = Record<
  string,
  {
    items?: SingleMultiSelectionSliderFormattedResponses[];
    restScores?: CalculatedSubscaleScores;
  }
>;

export type Subscale = {
  items?: SingleMultiSelectionSliderFormattedResponses[];
  score?: number;
  optionText?: string;
  severity?: string | null;
  restScores: Record<string, Subscale>;
};

export type GroupedSubscales = Record<string, Subscale>;
