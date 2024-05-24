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
    'data-testid': 'dashboard-add-users-fname',
  },
  {
    name: Fields.lastName,
    'data-testid': 'dashboard-add-users-lname',
  },
  {
    name: Fields.email,
    'data-testid': 'dashboard-add-users-email',
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
