import { Option } from 'shared/components/FormComponents';

export type FormValues = {
  firstName: string;
  lastName: string;
  nickName: string;
  email: string;
  MRN: string;
  workspacePrefix: string;
  role: string;
  language: string;
  users: string[];
};

export type Field = { name: keyof FormValues; options?: Option[] };

export type AddUserFormProps = {
  getInvitationsHandler: () => void;
};
