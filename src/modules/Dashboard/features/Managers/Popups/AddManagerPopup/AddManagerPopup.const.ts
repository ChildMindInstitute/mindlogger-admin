import { Roles } from 'shared/consts';

export const defaultValues = (roles?: Roles[]) => ({
  role: roles?.includes(Roles.Coordinator) ? Roles.Reviewer : Roles.Manager,
  email: '',
  firstName: '',
  lastName: '',
});

export const USER_ALREADY_INVITED = 'User already invited. Edit their access in the Managers tab.';
