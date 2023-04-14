import { ActionReducerMapBuilder, AsyncThunk } from '@reduxjs/toolkit';
import { AxiosResponse } from 'axios';

import { BaseSchema } from 'shared/state/Base';
import { RetentionPeriods } from 'shared/types';
import { AppletBody, AppletId, OwnerAndAppletIds } from 'api';
import { ItemResponseType } from 'shared/consts';
import { ColorResult } from 'react-color';

export type CreateAppletStateData = {
  builder: ActionReducerMapBuilder<AppletSchema>;
  thunk:
    | AsyncThunk<AxiosResponse, AppletId, Record<string, never>>
    | AsyncThunk<AxiosResponse, OwnerAndAppletIds, Record<string, never>>
    | AsyncThunk<AxiosResponse, SingleApplet, Record<string, never>>
    | AsyncThunk<AxiosResponse, AppletBody, Record<string, never>>;
  key: keyof AppletSchema;
};

export type ActivityFlow = {
  id?: string;
  name: string;
  description?: string | Record<string, string>;
  isSingleReport?: boolean;
  hideBadge?: boolean;
  order?: number;
  activityIds?: number[];
  isHidden?: boolean;
};

export type TextInputConfig = {
  removeBackButton: boolean;
  skippableItem: boolean;
  maxResponseLength: number;
  correctAnswerRequired: boolean;
  correctAnswer: string;
  numericalResponseRequired: boolean;
  responseDataIdentifier: boolean;
  responseRequired: boolean;
};

export type SingleAndMultipleSelectionConfig = {
  removeBackButton: boolean;
  skippableItem: boolean;
  randomizeOptions: boolean;
  addScores: boolean;
  setAlerts: boolean;
  addTooltip: boolean;
  setPalette: boolean;
  timer: number;
  additionalResponseOption: {
    textInputOption: boolean;
    textInputRequired: boolean;
  };
};

export type SliderConfig = {
  removeBackButton: boolean;
  skippableItem: boolean;
  addScores: boolean;
  setAlerts: boolean;
  showTickMarks: boolean;
  showTickLabels: boolean;
  continuousSlider: boolean;
  timer: number;
  additionalResponseOption: {
    textInputOption: boolean;
    textInputRequired: boolean;
  };
};

export type SliderItemResponseValues = {
  id?: string;
  minLabel: string;
  maxLabel: string;
  minValue: number;
  maxValue: number;
  minImage: string;
  maxImage: string;
  scores?: number[];
};

export type SingleAndMultipleSelectionOption = {
  id: string;
  text: string;
  image?: string;
  score?: number;
  tooltip?: string;
  color?: string | ColorResult;
  isHidden?: boolean;
};

export type SingleAndMultipleSelectItemResponseValues = {
  options: Array<SingleAndMultipleSelectionOption>;
};

export type TextItemResponseValues = null;

export type ResponseValues =
  | TextItemResponseValues
  | SingleAndMultipleSelectItemResponseValues
  | SliderItemResponseValues;

export type Config = TextInputConfig | SingleAndMultipleSelectionConfig | SliderConfig;

export type ItemAlert = {
  message: string;
  option: string;
  item: string;
  slider: string;
  min: number;
  max: number;
};

export type Item = {
  id?: string;
  key?: string;
  name: string;
  question: string | Record<string, string>;
  config: Config;
  responseType: ItemResponseType;
  responseValues: ResponseValues;
  paletteName?: string;
  alerts?: ItemAlert[];
};

export interface TextItem extends Item {
  responseType: ItemResponseType.Text;
  config: Config;
  responseValues: TextItemResponseValues;
}

export interface SingleSelectItem extends Item {
  responseType: ItemResponseType.SingleSelection;
  config: Config;
  responseValues: SingleAndMultipleSelectItemResponseValues;
}

export interface MultiSelectItem extends Item {
  responseType: ItemResponseType.MultipleSelection;
  config: Config;
  responseValues: SingleAndMultipleSelectItemResponseValues;
}

export interface SliderItem extends Item {
  responseType: ItemResponseType.Slider;
  config: Config;
  responseValues: SliderItemResponseValues;
}

export type Activity = {
  id?: string;
  key?: string;
  name: string;
  order?: number;
  description: string | Record<string, string>;
  splashScreen?: string;
  image?: string;
  showAllAtOnce?: boolean;
  isSkippable?: boolean;
  isReviewable?: boolean;
  responseIsEditable?: boolean;
  isHidden?: boolean;
  items: Item[];
};

type Theme = {
  id: string;
  name: string;
  logo: string;
  backgroundImage: string;
  primaryColor: string;
  secondaryColor: string;
  tertiaryColor: string;
  public: boolean;
};

export type SingleApplet = {
  id?: string;
  displayName: string;
  version?: string;
  description: string | Record<string, string>;
  about: string | Record<string, string>;
  createdAt?: string;
  updatedAt?: string;
  image: string;
  watermark: string;
  themeId: string | null;
  reportServerIp?: string;
  reportPublicKey?: string;
  reportRecipients?: string[];
  reportIncludeUserId?: boolean;
  reportIncludeCaseId?: boolean;
  reportEmailBody?: string;
  retentionPeriod?: number;
  retentionType?: RetentionPeriods;
  activities: Activity[];
  activityFlows: ActivityFlow[];
  theme?: Theme;
  password?: string;
};

export type AppletSchema = {
  applet: BaseSchema<{ result: SingleApplet } | null>;
};
