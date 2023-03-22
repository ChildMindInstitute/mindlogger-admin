import { ActionReducerMapBuilder, AsyncThunk } from '@reduxjs/toolkit';
import { AxiosResponse } from 'axios';

import { BaseSchema } from 'shared/state/Base';
import { AppletId, GetAppletsParams } from 'api';

export type CreateAppletsStateData = {
  builder: ActionReducerMapBuilder<AppletsSchema>;
  thunk:
    | AsyncThunk<AxiosResponse, GetAppletsParams, Record<string, never>>
    | AsyncThunk<AxiosResponse, AppletId, Record<string, never>>;
  key: keyof AppletsSchema;
};

export type Applet = {
  id: string;
  displayName: string;
  version: string;
  description: string;
  about: string;
  image: string;
  watermark: string;
  themeId: string;
  reportServerIp: string;
  reportPublicKey: string;
  reportRecipients: string[];
  reportIncludeUserId: boolean;
  reportIncludeCaseId: boolean;
  reportEmailBody: string;
  createdAt: string;
  updatedAt: string;
};

export type ActivityFlow = {
  id: string;
  name: string;
  description: string;
  ordering: number;
  isSingleReport?: boolean;
  hideBadge?: boolean;
  activityIds?: number[];
  isHidden?: boolean;
};

export type Activity = {
  id: string;
  name: string;
  description: string;
  ordering: number;
  splashScreen?: string;
  image?: string;
  showAllAtOnce?: boolean;
  isSkippable?: boolean;
  isReviewable?: boolean;
  responseIsEditable?: boolean;
  isHidden?: boolean;
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
  id: string;
  displayName: string;
  version: string;
  description: string;
  about: string;
  createdAt: string;
  updatedAt: string;
  image?: string;
  watermark?: string;
  themeId?: string;
  reportServerIp?: string;
  reportPublicKey?: string;
  reportRecipients?: string[];
  reportIncludeUserId?: boolean;
  reportIncludeCaseId?: boolean;
  reportEmailBody?: string;
  retentionPeriod?: number;
  retentionType?: 'indefinitely' | 'days' | 'weeks' | 'months' | 'years';
  activities: Activity[];
  activityFlows: ActivityFlow[];
  theme: Theme;
};

export type AppletsSchema = {
  applets: BaseSchema<{ result: Applet[]; count: number } | null>;
  applet: BaseSchema<{ result: SingleApplet } | null>;
};
