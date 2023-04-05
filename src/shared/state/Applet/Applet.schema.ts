import { ActionReducerMapBuilder, AsyncThunk } from '@reduxjs/toolkit';
import { AxiosResponse } from 'axios';

import { BaseSchema } from 'shared/state/Base';
import { RetentionPeriods } from 'shared/types';
import { AppletBody, AppletId } from 'api';
import { ItemResponseType } from 'shared/consts';

export type CreateAppletStateData = {
  builder: ActionReducerMapBuilder<AppletSchema>;
  thunk:
    | AsyncThunk<AxiosResponse, AppletId, Record<string, never>>
    | AsyncThunk<AxiosResponse, SingleApplet, Record<string, never>>
    | AsyncThunk<AxiosResponse, AppletBody, Record<string, never>>;
  key: keyof AppletSchema;
};

export type ActivityFlow = {
  id?: string;
  name: string;
  description?: string | Record<string, string>;
  ordering?: number;
  isSingleReport?: boolean;
  hideBadge?: boolean;
  activityIds?: number[];
  isHidden?: boolean;
};

export type Config = {
  remove_back_button: boolean;
  skippable_item: boolean;
  max_response_length: number;
  correct_answer_required: boolean;
  correct_answer: string;
  numerical_response_required: boolean;
  response_data_identifier: boolean;
  response_required: boolean;
};

export type ResponseValues = Record<string, string>;

export type Item = {
  id?: number;
  name: string;
  question: string | Record<string, string>;
  config: Config;
  responseType: '' | ItemResponseType;
  responseValues: null | ResponseValues;
  order?: number;
};

export type Activity = {
  id?: string;
  key?: string;
  name: string;
  description: string | Record<string, string>;
  ordering?: number;
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
