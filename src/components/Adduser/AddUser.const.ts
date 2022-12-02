import { Field } from './Adduser.types';

export const Roles = {
  user: 'user',
  manager: 'manager',
  coordinator: 'coordinator',
  editor: 'editor',
  reviewer: 'reviewer',
} as const;

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
    labelKey: Roles.user,
    value: Roles.user,
  },
  {
    labelKey: Roles.manager,
    value: Roles.manager,
  },
  {
    labelKey: Roles.coordinator,
    value: Roles.coordinator,
  },
  {
    labelKey: Roles.editor,
    value: Roles.editor,
  },
  {
    labelKey: Roles.reviewer,
    value: Roles.reviewer,
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
  role: Roles.user,
  lang: Langs.en,
};
