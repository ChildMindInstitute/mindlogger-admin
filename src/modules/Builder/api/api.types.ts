import { AppletId } from 'shared/api/api.types';
import { IntegrationTypes } from 'shared/consts';

export type GetThemesParams = {
  search?: string;
  page?: number;
  limit?: number;
  ordering?: string;
  public?: boolean;
  allowRename?: boolean;
  creatorId?: string;
};

export type Theme = {
  name: string;
  logo: string;
  backgroundImage: string;
  primaryColor: string;
  secondaryColor: string;
  tertiaryColor: string;
  id: string;
  public: boolean;
  allowRename: boolean;
};

export type Themes = Theme[];

export type LorisUserVisits = {
  userId: string;
  visits: string[];
};

export type LorisActivityUsersVisits = {
  [key: string]: LorisUserVisits[];
};

export type CommonActivity = {
  activityId: string;
  activityName: string;
  answerId: string;
  version: string;
  completedDate: string;
};

export type LorisAnswer = CommonActivity & {
  userId: string;
  secretUserId: string;
};

export type LorisUsersVisits = {
  activityVisits: LorisActivityUsersVisits;
  answers: LorisAnswer[];
};

export type LorisUserAnswerVisit = LorisAnswer & {
  visits?: string[];
  visit?: string;
  selected?: boolean;
};

export type LorisUsersVisit = {
  userId: string;
  secretUserId: string;
  activities: Array<CommonActivity & { visit: string }>;
};

export type UploadLorisUsersVisitsParams = AppletId & {
  payload: LorisUsersVisit[];
};

export type FetchIntegrationStatusParams = {
  // currently set as snake case on the API
  applet_id: string;
  integration_type: IntegrationTypes;
};

export type FetchIntegrationProjectsParams = {
  hostname: string;
  username: string;
  password: string;
  integrationType: IntegrationTypes;
};

export type LorisIntegrationConfiguration = {
  hostname: string;
  project: string;
  username: string;
  password?: string;
};

export type SaveIntegrationParams<T> = {
  appletId: string;
  integrationType: IntegrationTypes;
  configuration: T;
};

// Specific type for Loris
export type SaveLorisIntegrationParams = SaveIntegrationParams<LorisIntegrationConfiguration>;
