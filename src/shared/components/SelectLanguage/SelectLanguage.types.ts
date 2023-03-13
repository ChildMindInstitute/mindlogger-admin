import { LanguageItem } from 'shared/components/Language/Language.types';

export type SelectLanguageProps = {
  open: boolean;
  onClose: (Language?: LanguageItem) => void;
  languages: LanguageItem[];
  currentLanguage: LanguageItem;
};
