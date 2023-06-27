import {
  ItemAlert,
  Config,
  ResponseValues,
  ConditionalLogic,
  GyroscopeGeneralSettings,
  GyroscopePracticeSettings,
  GyroscopeTestSettings,
  SubscaleSetting,
  ScoresAndReports,
  ActivitySettingsSubscale,
} from 'shared/state';
import { ItemResponseType, PerfTaskItemType, SubscaleTotalScore } from 'shared/consts';
import { ArrayElement } from 'shared/types';

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
  subscaleSetting?: SubscaleSetting<string> | null;
  scoresAndReports?: ScoresAndReports;
  calculateTotalScore?: SubscaleTotalScore;
  conditionalLogic?: ConditionalLogic[];
  totalScoresTableData?: string;
  isPerformanceTask?: boolean;
  performanceTaskType?: PerfTaskItemType;
};

export type SubscaleFormValue = ArrayElement<
  NonNullable<NonNullable<ActivityFormValues['subscaleSetting']>['subscales']>
>;

export enum CorrectPress {
  Left = 'left',
  Right = 'right',
}

export type ActivityFlowItem = {
  id?: string;
  key?: string;
  activityKey: string;
};

export type GyroscopeFormValues = {
  id?: string;
  key?: string;
  name: string;
  description: string;
  isHidden: boolean;
  general: GyroscopeGeneralSettings;
  practice: GyroscopePracticeSettings;
  test: GyroscopeTestSettings;
  isPerformanceTask?: boolean;
  performanceTaskType?: PerfTaskItemType;
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
  image: string;
  watermark: string;
  themeId?: string | null;
  activityFlows: ActivityFlowFormValues[];
  activities: ActivityFormValues[];
};

export type GetNewPerformanceTask = {
  name?: string;
  description?: string;
  performanceTask?: ActivityFormValues;
  performanceTaskType?: PerfTaskItemType;
};

export enum ConditionRowType {
  Item = 'item',
  Score = 'score',
  Section = 'section',
}

export type ItemResponseTypeNoPerfTasks = Exclude<
  ItemResponseType,
  'flanker' | 'gyroscope' | 'touch' | 'ABTrailsIpad' | 'ABTrailsMobile'
>;

export type GetActivitySubscaleItems = {
  activityItemsObject: Record<string, ItemFormValues>;
  subscalesObject: Record<string, ActivitySettingsSubscale>;
  subscaleItems: ActivitySettingsSubscale['items'];
};

export type GetActivitySubscaleSettingDuplicated = {
  oldSubscaleSetting: ActivityFormValues['subscaleSetting'];
  oldItems: ItemFormValues[];
  newItems: ItemFormValues[];
};
