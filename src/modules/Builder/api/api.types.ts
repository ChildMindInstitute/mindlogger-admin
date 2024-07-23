import { AppletId } from 'shared/api/api.types';

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
  activityHistoryId: string;
  userId: string;
  secretUserId: string;
};

export type LorisUsersVisits = {
  activityHistoryVisits: LorisActivityUsersVisits;
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
