import { SingleApplet } from 'shared/state';

export type SignInRefreshTokenArgs = {
  refreshToken: string | null;
};

export type AppletId = { appletId: string };

export type ActivityId = { activityId: string };

export type ActivityFlowId = { activityFlowId: string };

export type AppletBody = AppletId & {
  body: SingleApplet;
};

export type AlertListParams = {
  search?: string;
  page?: number;
  limit?: number;
  ordering?: string;
};

export type Response<T> = {
  count: number;
  result: T[];
};

export type ResponseWithObject<T> = {
  count?: number;
  result: T;
};

export type AppletUniqueName = {
  name: string;
};

export type MediaUploadFields = {
  AWSAccessKeyId: string;
  key: string;
  policy: string;
  signature: string;
  'x-amz-security-token': string;
};

export type FileUploadUrlResult = {
  fields: MediaUploadFields;
  uploadUrl: string;
  url: string;
};

export type RefreshResponse = {
  accessToken: string;
  refreshToken: string;
  tokenType: string | null;
};
