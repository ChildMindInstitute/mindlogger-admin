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
  allowEdit: boolean;
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

export enum CorrectPress {
  Left = 'left',
  Right = 'right',
}

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

export type AppletFormValues = {
  id?: string;
  displayName: string;
  description: string;
  about: string;
  image?: string;
  watermark?: string;
  themeId?: string | null;
  activityFlows: ActivityFlowFormValues[];
  activities: ActivityFormValues[];
};

export type GetNewPerformanceTask = {
  name?: string;
  description?: string;
  performanceTask?: ActivityFormValues;
  isFlankerItem?: boolean;
};

export type ItemResponseTypeNoPerfTasks = Exclude<
  ItemResponseType,
  'flanker' | 'gyroscope' | 'touch' | 'ABTrailsIpad' | 'ABTrailsMobile'
>;
