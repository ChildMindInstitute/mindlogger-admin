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

export type LorisActivity = {
  activityId: string;
  activityName: string;
  answerId: string;
  version: string;
  completedDate: string;
};

export type LorisUsersVisit = {
  userId: string;
  secretUserId: string;
  activities: LorisActivity[];
};

export type UploadLorisUsersVisitsParams = AppletId & {
  payload: LorisUsersVisit[];
};

export type LorisUserVisits = {
  userId: string;
  visits: string[];
};

export type LorisActivityUsersVisits = {
  [key: string]: LorisUserVisits[];
};

export type LorisAnswer = {
  activityId: string;
  activityHistoryId: string;
  activityName: string;
  userId: string;
  secretUserId: string;
  answerId: string;
  version: string;
  completedDate: string;
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
