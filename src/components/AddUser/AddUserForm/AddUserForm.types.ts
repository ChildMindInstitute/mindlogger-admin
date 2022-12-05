import { Option } from 'components/FormComponents/SelectController/SelectController.types';

export type FormValues = {
  firstName: string;
  lastName: string;
  nickName: string;
  email: string;
  MRN: string;
  accountName: string;
  role: string;
  lang: string;
  users: string[];
};

export type Field = { name: keyof FormValues; options?: Option[] };

export type AddUserFormProps = {
  getInvitationsHandler: () => void;
};
