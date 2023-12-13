import { LanguageItem } from '../Language.types';

export type SelectLanguageProps = {
  open: boolean;
  onClose: (Language?: LanguageItem) => void;
  currentLanguage: LanguageItem;
};
