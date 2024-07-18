import { ParticipantTag, Roles } from 'shared/consts';
import { Encryption } from 'shared/utils';
import { ActivityFlow, Activity } from 'redux/modules';

import { Invitation, InvitationStatus } from '../features/Applet/AddUser/AddUser.types';

export type ManagerApplet = {
  id: string;
  displayName: string;
  image?: string;
  roles: {
    accessId?: string;
    role: Roles;
  }[];
  encryption?: Encryption;
};

export type Manager = {
  id: string;
  firstName: string;
  lastName: string;
  title: string | null;
  email: string;
  roles: Roles[];
  lastSeen: string;
  isPinned?: boolean;
  createdAt: string;
  applets: ManagerApplet[];
  titles: string[];
  status: InvitationStatus;
  invitationKey: string | null;
};

export type RespondentDetail = {
  appletId: string;
  appletDisplayName: string;
  appletImage?: string;
  accessId: string;
  respondentNickname: string;
  respondentSecretId: string;
  hasIndividualSchedule: boolean;
  encryption?: Encryption;
  subjectId: string;
  subjectTag?: ParticipantTag | null;
  subjectFirstName: string;
  subjectLastName: string;
  subjectCreatedAt: string;

  /**
   * The `key` in `/invitations/{key}`. This is `null` after the invitation is approved
   */
  invitation: Invitation | null;
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
  id: string;
  nickname: string;
  secretUserId: string;
  lastSeen: string | null;
  tag?: ParticipantTag | null;
  userId: string | null;
};

export enum AccountType {
  Full = 'full',
  Limited = 'limited',
}

export type WorkspaceInfo = {
  hasManagers: boolean;
  name: string;
};
export type HydratedActivityFlow = ActivityFlow & {
  activities: Activity[];
};
