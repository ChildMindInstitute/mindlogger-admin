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
  _accessLevel: number;
  _id: string;
  _modelType: string;
};

export type AccountData = {
  accountId: string;
  accountName: string;
  isDefaultName: boolean;
  applets?: {
    coordinator: string[];
    editor: string[];
    manager: string[];
    owner: string[];
    reviewer: string[];
    user: string[];
  };
};

export type AuthToken = {
  expires: string;
  token: string;
  scope?: string[];
};

export type AuthData = {
  account: AccountData;
  authToken: AuthToken;
  user: User;
  message?: string;
};

export type AuthSchema = {
  authentication: BaseSchema<AuthData | null>;
  isAuthorized: boolean;
};
