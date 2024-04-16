import { Languages } from 'api';
import { ParticipantSnippetProps } from 'modules/Dashboard/components';

export type UpgradeAccountPopupProps = {
  popupVisible: boolean;
  appletId: string | null;
  subjectId: string;
  onClose?: (shouldRefetch: boolean) => void;
  'data-testid'?: string;
} & ParticipantSnippetProps;

export type UpgradeAccountFormValues = {
  email: string;
  language: Languages;
};

export const Fields = {
  email: 'email',
  language: 'language',
} as const;
