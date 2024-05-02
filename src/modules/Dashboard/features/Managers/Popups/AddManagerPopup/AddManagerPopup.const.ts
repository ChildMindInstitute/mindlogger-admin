import { Roles } from 'shared/consts';

export const defaultValues = {
  role: Roles.Manager,
  email: '',
  firstName: '',
  lastName: '',
};

export const USER_ALREADY_INVITED = 'User already invited. Edit their access in the Managers tab.';
