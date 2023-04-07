import { Option } from 'shared/components/FormComponents';

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
};

export type WworkspaceInfo = {
  hasManagers: boolean;
  name: string;
};
