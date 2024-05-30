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

export const getRoles = (roles?: Roles[]) => [
  {
    labelKey: Roles.Respondent,
    value: Roles.Respondent,
  },
  ...(roles?.includes(Roles.Coordinator)
    ? []
    : [
        {
          labelKey: Roles.Manager,
          value: Roles.Manager,
        },
        {
          labelKey: Roles.Coordinator,
          value: Roles.Coordinator,
        },
        {
          labelKey: Roles.Editor,
          value: Roles.Editor,
        },
      ]),
  {
    labelKey: Roles.Reviewer,
    value: Roles.Reviewer,
  },
];
