import { Option } from 'shared/components/FormComponents';
import { Roles } from 'shared/consts';

import { SubmitBtnType } from './AddUserForm.const';

export type AddUserFormValues = {
  firstName: string;
  lastName: string;
  role: string;
  submitBtnType: SubmitBtnType;
  email?: string;
  nickname?: string;
  secretUserId?: string;
  workspacePrefix?: string;
  language?: string;
  respondents?: { label: string; id: string }[];
};

export type Field = { name: keyof AddUserFormValues; options?: Option[]; 'data-testid'?: string };

export type AddUserFormProps = {
  getInvitationsHandler: () => void;
  roles?: Roles[];
};
