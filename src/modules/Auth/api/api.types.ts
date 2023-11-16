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
