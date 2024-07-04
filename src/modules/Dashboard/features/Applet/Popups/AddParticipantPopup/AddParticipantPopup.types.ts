import { Languages } from 'api';
import { AccountType } from 'modules/Dashboard/types';
import { UserSelectableParticipantTag } from 'shared/consts';

export type AddParticipantPopupProps = {
  popupVisible: boolean;
  appletId: string | null;
  onClose?: (shouldRefetch: boolean) => void;
  'data-testid': string;
};

export enum AddParticipantSteps {
  AccountType = 'accountType',
  AccountForm = 'accountForm',
}

export type AddParticipantFormValues = {
  accountType: AccountType;
  firstName: string;
  lastName: string;
  email?: string;
  nickname?: string;
  secretUserId: string;
  tag?: UserSelectableParticipantTag;
  language: Languages;
};

export const Fields = {
  firstName: 'firstName',
  lastName: 'lastName',
  email: 'email',
  secretUserId: 'secretUserId',
  nickname: 'nickname',
  tag: 'tag',
  language: 'language',
} as const;
