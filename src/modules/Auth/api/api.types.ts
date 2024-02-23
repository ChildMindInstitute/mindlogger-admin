export type SignIn = { email: string; password: string };

export type SignUpArgs = {
  body: {
    email: string;
    firstName: string;
    lastName: string;
    password: string;
  };
};

export type ResetPassword = { email: string };

export type RecoverPasswordHealthCheck = { email: string | null; key: string | null };

export type ApproveRecoveryPassword = { email: string; key: string; password: string };
