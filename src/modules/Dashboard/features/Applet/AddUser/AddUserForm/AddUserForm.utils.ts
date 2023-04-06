import { Roles } from 'shared/consts';

export const getUrl = (role: string) => {
  switch (role) {
    case Roles.Respondent:
      return 'respondent';
    case Roles.Reviewer:
      return 'reviewer';
    default:
      return 'managers';
  }
};
