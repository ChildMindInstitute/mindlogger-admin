export type SignIn = {
  email: string;
  password: string;
};

export type SignInWithToken = {
  token: string;
};

export type SignUpArgs = {
  body: {
    email: string;
    firstName: string;
    lastName: string;
    password: string;
  };
};

export type ResetPassword = {
  email: string;
};

export type SwitchAccount = {
  accountId: string;
};

export type AccountUserList = {
  appletId?: string;
  role?: string;
  MRN?: string;
  pagination?: { allow: boolean };
  sort?: { allow: boolean };
};
