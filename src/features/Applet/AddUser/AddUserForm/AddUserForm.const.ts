import { Roles } from 'consts';

import { Field } from './AddUserForm.types';

export const Langs = {
  fr: 'fr',
  en: 'en',
} as const;

export const Fields = {
  firstName: 'firstName',
  lastName: 'lastName',
  email: 'email',
  MRN: 'MRN',
  nickName: 'nickName',
  accountName: 'accountName',
  role: 'role',
  users: 'users',
  lang: 'lang',
} as const;

export const roles = [
  {
    labelKey: Roles.User,
    value: Roles.User,
  },
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
  nickName: '',
  email: '',
  MRN: '',
  role: Roles.User,
  lang: Langs.en,
};
