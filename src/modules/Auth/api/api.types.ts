export type SignIn = { email: string; password: string };

export type SignUpArgs = {
  body: {
    email: string;
    firstName: string;
    lastName: string;
    password: string;
  };
};

export type SignInRefreshTokenArgs = {
  refreshToken: string | null;
};

export type ResetPassword = { email: string };
