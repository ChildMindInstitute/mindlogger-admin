import { Activity, ActivityFlow, Condition, Item, ScoreReport } from 'shared/state';

import {
  flankerItems,
  getABTrailsItems,
  getGyroscopeOrTouchItems,
  getUnityItems,
} from './BuilderApplet.utils';

export type GetSectionConditions = {
  items?: Item[];
  conditions?: Condition[];
  scores?: ScoreReport[];
};

export type GetMessageItem = {
  name: string;
  question: string;
  order?: number;
};

type FlankerItemsType = typeof flankerItems;
type GyroscopeOrTouchItemsType = ReturnType<typeof getGyroscopeOrTouchItems>;
type ABTrailsItemsType = ReturnType<typeof getABTrailsItems>;
type UnityItemsType = ReturnType<typeof getUnityItems>;
export type PerformanceTaskItems =
  | FlankerItemsType
  | GyroscopeOrTouchItemsType
  | ABTrailsItemsType
  | UnityItemsType;

export type GetActivityFlows = {
  activityFlows: ActivityFlow[];
  activities: Activity[];
  nonReviewableKeys: string[];
};
