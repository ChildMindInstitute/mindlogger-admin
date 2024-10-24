import { ParticipantTag } from 'shared/consts';

export type Invitation = {
  appletId: string;
  appletName: string;
  secretUserId: string | null;
  nickname: string | null;
  firstName: string;
  lastName: string;
  role: string;
  email: string;
  createdAt: string;
  key: string;
  status: InvitationStatus;
  meta: {
    subject_id?: string;
    secret_user_id?: string | null;
  };
  tag: ParticipantTag | null;
  title: string | null;
};

export type Invitations = {
  result: Invitation[];
  count: number;
};

export type InvitationStatus = 'pending' | 'approved';
