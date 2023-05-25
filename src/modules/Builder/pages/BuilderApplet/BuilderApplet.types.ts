import {
  ItemAlert,
  Config,
  ActivitySettingsSubscale,
  ResponseValues,
  ConditionalLogic,
  ActivitySettingsSection,
} from 'shared/state';
import { ItemResponseType, SubscaleTotalScore } from 'shared/consts';

export type ItemFormValues = {
  id?: string;
  key?: string;
  name: string;
  question: string;
  config: Config;
  responseType: ItemResponseType | '';
  responseValues: ResponseValues;
  alerts?: ItemAlert[];
};

export type ActivityFormValues = {
  id?: string;
  key?: string;
  name: string;
  description: string;
  splashScreen?: string;
  image?: string;
  showAllAtOnce?: boolean;
  isSkippable?: boolean;
  responseIsEditable?: boolean;
  isReviewable?: boolean;
  isHidden?: boolean;
  items: ItemFormValues[];
  subscales?: ActivitySettingsSubscale[];
  calculateTotalScore?: SubscaleTotalScore;
  conditionalLogic?: ConditionalLogic[];
  sections?: ActivitySettingsSection[];
  totalScoresTableData?: string;
  isPerformanceTask?: boolean;
  isFlankerItem?: boolean;
};

export type FlankerButtonSetting = {
  name: string | null;
  image: string | null;
};

export type FlankerFixationSettings = {
  image: string | null;
  duration: number;
};

type FlankerStimulusId = string;

export enum CorrectPress {
  Left = 'LEFT',
  Right = 'RIGHT',
}

export type FlankerStimulusSettings = {
  id: FlankerStimulusId;
  image: string;
  correctPress: CorrectPress;
};

type FlankerBlockSettings = {
  order: Array<FlankerStimulusId>;
};

type FlankerPracticeSettings = {
  instruction: string;
  blocks: Array<FlankerBlockSettings>;
  stimulusDuration: number;
  threshold: number;
  randomizeOrder: boolean;
  showFeedback: boolean;
  showSummary: boolean;
};

type FlankerTestSettings = {
  instruction: string;
  blocks: Array<FlankerBlockSettings>;
  stimulusDuration: number;
  randomizeOrder: boolean;
  showFeedback: boolean;
  showSummary: boolean;
};

type FlankerGeneralSettings = {
  instruction: string;
  buttons: Array<FlankerButtonSetting>;
  fixation: FlankerFixationSettings | null;
  stimulusTrials: Array<FlankerStimulusSettings>;
};

export type FlankerFormValues = {
  id?: string;
  key?: string;
  name: string;
  description: string;
  isHidden?: boolean;
  general: FlankerGeneralSettings;
  practice: FlankerPracticeSettings;
  test: FlankerTestSettings;
  isPerformanceTask: boolean;
  isFlankerItem?: boolean;
};

export type ActivityFlowItem = {
  id?: string;
  key?: string;
  activityKey: string;
};

export type ActivityFlowFormValues = {
  id?: string;
  key?: string;
  name: string;
  description: string;
  isSingleReport?: boolean;
  hideBadge?: boolean;
  items?: ActivityFlowItem[];
  isHidden?: boolean;
};

export type ActivityValue = ActivityFormValues | FlankerFormValues;

export type AppletFormValues = {
  id?: string;
  displayName: string;
  description: string;
  about: string;
  image?: string;
  watermark?: string;
  themeId?: string | null;
  activityFlows: ActivityFlowFormValues[];
  activities: ActivityValue[];
};

export type GetNewPerformanceTask = {
  name?: string;
  description?: string;
  performanceTask?: FlankerFormValues;
  isFlankerItem?: boolean;
};
