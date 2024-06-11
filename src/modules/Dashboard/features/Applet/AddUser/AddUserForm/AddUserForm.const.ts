import { Roles } from 'shared/consts';
import { Languages } from 'shared/api';

import { Field } from './AddUserForm.types';

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

export const languages = [
  {
    labelKey: Languages.FR,
    value: Languages.FR,
  },
  {
    labelKey: Languages.EN,
    value: Languages.EN,
  },
];

export const nameFields: Field[] = [
  {
    name: Fields.firstName,
    'data-testid': 'dashboard-add-users-fname',
  },
  {
    name: Fields.lastName,
    'data-testid': 'dashboard-add-users-lname',
  },
];

export enum SubmitBtnType {
  WithInvitation = 'withInvitation',
  WithoutInvitation = 'withoutInvitation',
}

export const defaultValues = {
  firstName: '',
  lastName: '',
  nickname: '',
  email: '',
  secretUserId: '',
  role: Roles.Respondent,
  language: Languages.EN,
  submitBtnType: SubmitBtnType.WithInvitation,
};

export const dataTestId = 'dashboard-add-users';

export const RESPONDENT_ALREADY_INVITED = 'Respondent already invited.';
export const EMAIL_IN_USE = 'That email is already in use for shell account.';
