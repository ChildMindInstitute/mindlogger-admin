import { Option } from 'shared/components/FormComponents';
import { Roles } from 'shared/consts';

export type FormValues = {
  firstName: string;
  lastName: string;
  nickname: string;
  email: string;
  secretUserId: string;
  workspacePrefix: string;
  role: string;
  language: string;
  respondents: { label: string; id: string }[];
};

export type Field = { name: keyof FormValues; options?: Option[] };

export type AddUserFormProps = {
  getInvitationsHandler: () => void;
  priorityRole: Roles | null;
};

export type WorkspaceInfo = {
  hasManagers: boolean;
  name: string;
};
