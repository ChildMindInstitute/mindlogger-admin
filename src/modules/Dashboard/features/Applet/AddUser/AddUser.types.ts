export type Invitation = {
  secretUserId: string | null;
  nickname: string | null;
  firstName: string;
  lastName: string;
  role: string;
  email: string;
  createdAt: string;
  key: string;
  meta: {
    subject_id?: string;
  };
};

export type Invitations = {
  result: Invitation[];
  count: number;
};
