export type Invitation = {
  secretUserId?: string;
  firstName: string;
  lastName: string;
  role: string;
  email: string;
  createdAt: string;
  key: string;
  meta: {
    secret_user_id?: string;
    nickname?: string;
  };
};

export type Invitations = {
  result: Invitation[];
  count: number;
};
