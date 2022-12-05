import { Field } from './AdduserForm.types';

export const roles = [
  {
    labelKey: 'user',
    value: 'user',
  },
  {
    labelKey: 'manager',
    value: 'manager',
  },
  {
    labelKey: 'coordinator',
    value: 'coordinator',
  },
  {
    labelKey: 'editor',
    value: 'editor',
  },
  {
    labelKey: 'reviewer',
    value: 'reviewer',
  },
];

export const langs = [
  {
    labelKey: 'fr',
    value: 'fr',
  },
  {
    labelKey: 'en',
    value: 'en',
  },
];

export const fields: Field[] = [
  {
    name: 'firstName',
  },
  {
    name: 'lastName',
  },
  {
    name: 'nickname',
  },
  {
    name: 'email',
  },
  {
    name: 'role',
    options: roles,
  },
  {
    name: 'secretUserId',
  },
  {
    name: 'language',
    options: langs,
  },
];
