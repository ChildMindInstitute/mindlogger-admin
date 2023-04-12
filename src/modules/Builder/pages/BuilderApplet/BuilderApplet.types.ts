import {
  ItemAlert,
  Config,
  SingleAndMultipleSelectItemResponseValues,
  TextItemResponseValues,
  SliderItemResponseValues,
} from 'shared/state';
import { ItemResponseType } from 'shared/consts';

export type ItemFormValues = {
  id?: string;
  name: string;
  question: string;
  config: Config;
  responseType: ItemResponseType | '';
  responseValues:
    | SingleAndMultipleSelectItemResponseValues
    | TextItemResponseValues
    | SliderItemResponseValues;
  alerts: ItemAlert[];
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
  isHidden?: boolean;
  items: ItemFormValues[];
};

export type ActivityFlowFormValues = {
  id?: string;
  name: string;
  description: string;
  isSingleReport?: boolean;
  hideBadge?: boolean;
  items?: { activityKey: string }[];
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
