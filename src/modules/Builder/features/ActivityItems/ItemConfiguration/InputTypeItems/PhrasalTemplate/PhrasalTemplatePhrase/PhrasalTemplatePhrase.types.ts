import { Item } from 'redux/modules';

export interface PhrasalTemplatePhraseProps {
  canRemovePhrase?: boolean;
  name?: string;
  onRemovePhrase?: () => void;
  index?: number;
  responseOptions?: Item[];
}
