import { UiLanguages } from 'shared/ui';

export type LanguageItem = {
  value: UiLanguages;
  label: string;
  type: string;
  component: JSX.Element;
};
