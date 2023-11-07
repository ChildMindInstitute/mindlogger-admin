import { initialStateData } from 'shared/state';
import { AuthSchema } from './Auth.schema';

export const state: AuthSchema = {
  authentication: initialStateData,
  isAuthorized: false,
  isLogoutInProgress: false,
};
