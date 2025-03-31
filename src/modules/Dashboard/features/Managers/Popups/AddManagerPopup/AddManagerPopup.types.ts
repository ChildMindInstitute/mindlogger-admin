import { ApiLanguages } from 'api';
import { WorkspaceInfo } from 'modules/Dashboard/types';
import { Roles } from 'shared/consts';

export type AddManagerPopupProps = {
  popupVisible: boolean;
  appletId: string | null;
  onClose?: () => void;
  workspaceInfo: WorkspaceInfo | null;
  'data-testid'?: string;
};

export type AddManagerFormValues = {
  role: Roles;
  email: string;
  firstName: string;
  lastName: string;
  title?: string;
  language: ApiLanguages;
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
