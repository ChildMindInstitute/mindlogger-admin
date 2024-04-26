import { Languages } from 'api';
import { Roles } from 'shared/consts';

export type AddManagerPopupProps = {
  popupVisible: boolean;
  appletId: string | null;
  onClose?: (shouldRefetch: boolean) => void;
  'data-testid'?: string;
};

export type AddManagerFormValues = {
  role: Roles;
  email: string;
  firstName: string;
  lastName: string;
  title?: string;
  language: Languages;
  participants?: { label: string; id: string }[];
  workspaceName?: string;
};

export const Fields = {
  role: 'role',
  email: 'email',
  firstName: 'firstName',
  lastName: 'lastName',
  title: 'title',
  language: 'language',
  participants: 'participants',
  workspaceName: 'workspaceName',
} as const;
