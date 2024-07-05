import { Workspace } from 'redux/modules';
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

export type SoftLockData = {
  email?: string;
  redirectTo: string;
  workspace: Workspace | null;
};

export type AuthSchema = {
  authentication: BaseSchema<AuthData | null>;
  isAuthorized: boolean;
  isLogoutInProgress: boolean;
  softLockData?: SoftLockData;
};
