import { Languages } from 'api';
import { ParticipantSnippetInfo } from 'modules/Dashboard/components';

export type UpgradeAccountPopupProps = {
  popupVisible: boolean;
  appletId: string | null;
  subjectId: string;
  onClose?: (shouldRefetch: boolean) => void;
  'data-testid'?: string;
} & ParticipantSnippetInfo;

export type UpgradeAccountFormValues = {
  email: string;
  language: Languages;
};

export const Fields = {
  email: 'email',
  language: 'language',
} as const;
