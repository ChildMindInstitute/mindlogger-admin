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
  respondents: string[];
};

export type Field = { name: keyof FormValues; options?: Option[] };

export type AddUserFormProps = {
  getInvitationsHandler: () => void;
};
