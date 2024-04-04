import { Languages } from 'api';

export type AddParticipantPopupProps = {
  popupVisible: boolean;
  appletId: string | null;
  onClose?: (shouldRefetch: boolean) => void;
  'data-testid'?: string;
};

export enum AccountType {
  Full = 'full',
  Limited = 'limited',
}

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
