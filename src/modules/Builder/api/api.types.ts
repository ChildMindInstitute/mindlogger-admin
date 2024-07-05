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

export type CommonLorisActivity = {
  activityId: string;
  activityName: string;
  answerId: string;
  version: string;
  completedDate: string;
};

export type LorisActivityResponse = CommonLorisActivity & {
  visits: string[];
};

export type LorisActivityForm = CommonLorisActivity & {
  visit?: string;
  selected?: boolean;
};

export type LorisUsersVisit<T = LorisActivityResponse> = {
  userId: string;
  secretUserId: string;
  activities: T[];
};

export type UploadLorisUsersVisitsParams = AppletId & {
  payload: LorisUsersVisit<LorisActivityForm>[];
};
