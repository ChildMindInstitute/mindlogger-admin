import { BaseSchema } from 'shared/state/Base';
import { Roles } from 'shared/consts';

export type RespondentDetail = {
  appletId: string;
  appletDisplayName: string;
  appletImage?: string;
  accessId: string;
  respondentNickname: string;
  respondentSecretId: string;
  hasIndividualSchedule: boolean;
};

export type Respondent = {
  id: string;
  accessId: string;
  nicknames: string[];
  role: Roles;
  secretIds: string[];
  lastSeen: string;
  isPinned?: boolean;
  details: RespondentDetail[];
};

export type ManagerApplet = {
  id: string;
  displayName: string;
  image?: string;
  roles: {
    accessId?: string;
    role: Roles;
  }[];
};

export type Manager = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  roles: Roles[];
  lastSeen: string;
  isPinned?: boolean;
  applets: ManagerApplet[];
};

export type UsersSchema = {
  respondents: BaseSchema<{ result: Respondent[]; count: number } | null>;
  allRespondents: BaseSchema<{ result: Respondent[]; count: number } | null>;
  managers: BaseSchema<{ result: Manager[]; count: number } | null>;
};
