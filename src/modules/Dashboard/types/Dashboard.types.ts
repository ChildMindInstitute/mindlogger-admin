import { Roles } from 'shared/consts';

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
  isAnonymousRespondent: boolean;
};

export type RespondentDetails = {
  nickname: string;
  secretUserId: string;
  lastSeen: string | null;
};
