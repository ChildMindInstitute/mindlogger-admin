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
  subjectId: string;
};

export enum RespondentStatus {
  Invited = 'invited',
  NotInvited = 'not_invited',
  Pending = 'pending',
}

export type Respondent = {
  id: string | null;
  nicknames: string[];
  role: Roles;
  secretIds: string[];
  lastSeen: string;
  isPinned?: boolean;
  details: RespondentDetail[];
  isAnonymousRespondent: boolean;
  email: string | null;
  status: RespondentStatus;
};

export type RespondentDetails = {
  nickname: string;
  secretUserId: string;
  lastSeen: string | null;
};

export enum AccountType {
  Full = 'full',
  Limited = 'limited',
}
