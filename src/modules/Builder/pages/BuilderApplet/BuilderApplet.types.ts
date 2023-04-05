import { ResponseType, ResponseValues } from 'shared/state';

export type ItemFormValues = {
  id: string;
  name: string;
  question: string;
  responseType: ResponseType;
  responseValues: ResponseValues;
};

export type ActivityFormValues = {
  id: string;
  key?: string;
  name: string;
  description: string;
  splashScreen?: string;
  image?: string;
  showAllAtOnce?: boolean;
  isSkippable?: boolean;
  responseIsEditable?: boolean;
  isHidden?: boolean;
  items: ItemFormValues[];
};

export type ActivityFlowFormValues = {
  id: string;
  name: string;
  description: string;
  isSingleReport?: boolean;
  activityIds?: number[];
  isHidden?: boolean;
};

export type AppletFormValues = {
  id: string;
  displayName: string;
  description: string;
  about: string;
  image?: string;
  watermark?: string;
  themeId?: string | null;
  activityFlows: ActivityFlowFormValues[];
  activities: ActivityFormValues[];
};
