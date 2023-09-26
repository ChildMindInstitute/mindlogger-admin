import { Languages } from 'shared/api';

export type LanguageItem = {
  value: Languages;
  label: string;
  type: string;
  component: JSX.Element;
};
