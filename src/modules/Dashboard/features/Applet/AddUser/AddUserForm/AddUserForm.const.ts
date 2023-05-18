import { Roles } from 'shared/consts';

import { Field } from './AddUserForm.types';

export const Langs = {
  fr: 'fr',
  en: 'en',
} as const;

export const Fields = {
  firstName: 'firstName',
  lastName: 'lastName',
  email: 'email',
  secretUserId: 'secretUserId',
  nickname: 'nickname',
  workspacePrefix: 'workspacePrefix',
  role: 'role',
  respondents: 'respondents',
  language: 'language',
} as const;

export const getRoles = (priorityRole: Roles | null) => [
  {
    labelKey: Roles.Respondent,
    value: Roles.Respondent,
  },
  ...(priorityRole !== Roles.Coordinator
    ? [
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
      ]
    : []),
  {
    labelKey: Roles.Reviewer,
    value: Roles.Reviewer,
  },
];

export const langs = [
  {
    labelKey: Langs.fr,
    value: Langs.fr,
  },
  {
    labelKey: Langs.en,
    value: Langs.en,
  },
];

export const fields: Field[] = [
  {
    name: Fields.firstName,
  },
  {
    name: Fields.lastName,
  },
  {
    name: Fields.email,
  },
];

export const defaultValues = {
  firstName: '',
  lastName: '',
  nickname: '',
  email: '',
  secretUserId: '',
  role: Roles.Respondent,
  language: Langs.en,
};
