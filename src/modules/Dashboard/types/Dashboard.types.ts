import { ParticipantTag, Roles } from 'shared/consts';
import { Encryption } from 'shared/utils';
import { Invitation, InvitationStatus } from 'shared/types';
import { ActivityFlow, Activity } from 'redux/modules';
import { HydratedAssignment } from 'api';

import { Role } from '../features/Managers/Popups/ManagersEditAccessPopup/ManagersEditAccessPopup.types';

export type ManagerApplet = {
  id: string;
  displayName: string;
  image?: string;
  roles: Role[];
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

export type ParticipantDetail = {
  appletId: string;
  appletDisplayName: string;
  appletImage?: string;
  accessId: string | null;
  respondentNickname: string;
  respondentSecretId: string;
  hasIndividualSchedule: boolean;
  encryption?: Encryption;
  subjectId: string;
  subjectTag?: ParticipantTag | null;
  subjectFirstName: string;
  subjectLastName: string;
  subjectCreatedAt: string;
  roles: Roles[];

  /**
   * The `key` in `/invitations/{key}`. This is `null` after the invitation is approved
   */
  invitation: Invitation | null;
};

export enum ParticipantStatus {
  Invited = 'invited',
  NotInvited = 'not_invited',
  Pending = 'pending',
}

export type Participant = {
  id: string | null;
  nicknames: string[];
  secretIds: string[];
  lastSeen: string;
  isPinned?: boolean;
  details: ParticipantDetail[];
  isAnonymousRespondent: boolean;
  email: string | null;
  status: ParticipantStatus;
};

export type SubjectDetails = {
  id: string;
  nickname: string;
  secretUserId: string;
  lastSeen: string | null;
  tag?: ParticipantTag | null;
  userId: string | null;
  firstName: string;
  lastName: string;
};

export type SubjectDetailsWithRoles = SubjectDetails & {
  roles: Roles[];
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

export type AssignedHydratedActivityFlow = HydratedActivityFlow & {
  assignments?: HydratedAssignment[];
};
