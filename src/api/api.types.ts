export type SignIn = {
  email: string;
  password: string;
};

export type SignInWithToken = {
  token: string;
};

export type SignUp = {
  body: {
    email: string;
    firstName: string;
    lastName: string;
    password: string;
  };
};

export type ResetPassword = {
  body: {
    email: string;
    lang: string;
  };
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
