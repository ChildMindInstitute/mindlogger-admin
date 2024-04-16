import { Languages } from 'api';
import { AccountType } from 'modules/Dashboard/types';

export type AddParticipantPopupProps = {
  popupVisible: boolean;
  appletId: string | null;
  onClose?: (shouldRefetch: boolean) => void;
  'data-testid'?: string;
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
  language: Languages;
};

export const Fields = {
  firstName: 'firstName',
  lastName: 'lastName',
  email: 'email',
  secretUserId: 'secretUserId',
  nickname: 'nickname',
  language: 'language',
} as const;
