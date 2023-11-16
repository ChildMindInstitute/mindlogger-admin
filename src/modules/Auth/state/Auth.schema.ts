import { BaseSchema } from 'shared/state/Base';

export type User = {
  email: string;
  firstName: string;
  lastName: string;
  id: string;
};

export type AuthData = {
  user: User;
};

export type AuthSchema = {
  authentication: BaseSchema<AuthData | null>;
  isAuthorized: boolean;
  isLogoutInProgress: boolean;
};
