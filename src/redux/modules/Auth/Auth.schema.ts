import { BaseSchema } from 'redux/modules/Base';

export type User = {
  admin: boolean;
  created: string;
  creatorId: string;
  displayName: string;
  email: string;
  emailVerified: boolean;
  firstName: string;
  lastName: string;
  login: string;
  otp: boolean;
  public: boolean;
  size: number;
  status: string;
  _accessLevel: string;
  _id: string;
  _modelType: string;
};

export type Account = {
  accountId: string;
  accountName: string;
  applets: {
    coordinator: string[];
    editor: string[];
    manager: string[];
    owner: string[];
    reviewer: string[];
    user: string[];
  };
  isDefaultName: boolean;
};

export type AuthToken = {
  expires: string;
  scope: string[];
  token: string;
};

export type AuthData = {
  account: Account;
  authToken: AuthToken;
  user: User;
  message: string;
};

export type AuthSchema = {
  authentication: BaseSchema<AuthData | null>;
};
