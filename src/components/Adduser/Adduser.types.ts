import { Option } from 'components/FormComponents/SelectController/SelectController.types';

export type FormValues = {
  firstName: string;
  lastName: string;
  nickname: string;
  email: string;
  secretUserId: string;
  role: string;
  language: string;
};

export type Field = { name: keyof FormValues; options?: Option[] };
