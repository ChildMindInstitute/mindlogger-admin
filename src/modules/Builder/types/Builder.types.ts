import {
  ItemAlert,
  Config,
  ResponseValues,
  ConditionalLogic,
  SubscaleSetting,
  ScoresAndReports,
  ActivitySettingsSubscale,
} from 'shared/state';
import { ItemResponseType, PerfTaskType, SubscaleTotalScore } from 'shared/consts';
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
  performanceTaskType?: PerfTaskType;
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

export type GetNewActivity = {
  name?: string;
  activity?: ActivityFormValues;
};

export type GetNewPerformanceTask = {
  name?: string;
  description?: string;
  performanceTask?: ActivityFormValues;
  performanceTaskType?: PerfTaskType;
};

export enum ConditionRowType {
  Item = 'item',
  Score = 'score',
  Section = 'section',
}

export type ItemResponseTypeNoPerfTasks = Exclude<
  ItemResponseType,
  | ItemResponseType.Flanker
  | ItemResponseType.StabilityTracker
  | ItemResponseType.TouchPractice
  | ItemResponseType.TouchTest
  | ItemResponseType.ABTrailsMobileFirst
  | ItemResponseType.ABTrailsMobileSecond
  | ItemResponseType.ABTrailsMobileThird
  | ItemResponseType.ABTrailsMobileFourth
  | ItemResponseType.ABTrailsTabletFirst
  | ItemResponseType.ABTrailsTabletSecond
  | ItemResponseType.ABTrailsTabletThird
  | ItemResponseType.ABTrailsTabletFourth
>;

export enum RoundTypeEnum {
  Practice = 'practice',
  Test = 'test',
}

export enum DeviceType {
  Mobile = 'mobile',
  Tablet = 'tablet',
}

export enum GyroscopeItemNames {
  GeneralInstruction = 'Gyroscope_General_instruction',
  PracticeInstruction = 'Gyroscope_Calibration_Practice_instruction',
  TestInstruction = 'Gyroscope_Test_instruction',
  PracticeRound = 'Gyroscope_Calibration_Practice',
  TestRound = 'Gyroscope_Test',
}

export enum TouchItemNames {
  GeneralInstruction = 'Touch_General_instruction',
  PracticeInstruction = 'Touch_Calibration_Practice_instruction',
  TestInstruction = 'Touch_Test_instruction',
  PracticeRound = 'Touch_Calibration_Practice',
  TestRound = 'Touch_Test',
}

export enum FlankerItemNames {
  GeneralInstruction = 'Flanker_VSR_instructions',
  PracticeInstructionFirst = 'Flanker_Practice_instructions_1',
  PracticeInstructionSecond = 'Flanker_Practice_instructions_2',
  PracticeInstructionThird = 'Flanker_Practice_instructions_3',
  PracticeFirst = 'Flanker_Practice_1',
  PracticeSecond = 'Flanker_Practice_2',
  PracticeThird = 'Flanker_Practice_3',
  TestInstructionFirst = 'Flanker_test_instructions_1',
  TestInstructionSecond = 'Flanker_test_instructions_2',
  TestInstructionThird = 'Flanker_test_instructions_3',
  TestFirst = 'Flanker_test_1',
  TestSecond = 'Flanker_test_2',
  TestThird = 'Flanker_test_3',
}

export enum FlankerSamplingMethod {
  Randomize = 'randomize-order',
  Fixed = 'fixed-order',
}

export enum FlankerInstructionPositions {
  General = 0,
  Practice = 1,
  Test = 7,
}
export enum FlankerItemPositions {
  PracticeFirst = 2,
  PracticeSecond = 4,
  PracticeThird = 6,
  TestFirst = 8,
  TestSecond = 10,
  TestThird = 12,
}

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
