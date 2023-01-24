import { BaseSchema } from 'redux/modules/Base';

export type User = {
  email: string;
  fullName: string;
  id: number;
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
  user: User;
  account?: AccountData;
};

export type AuthSchema = {
  authentication: BaseSchema<AuthData | null>;
  isAuthorized: boolean;
};
