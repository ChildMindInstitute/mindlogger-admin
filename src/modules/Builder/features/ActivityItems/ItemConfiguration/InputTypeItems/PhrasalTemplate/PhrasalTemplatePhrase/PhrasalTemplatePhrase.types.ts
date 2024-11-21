import { Item } from 'redux/modules';

export interface PhrasalTemplatePhraseProps {
  name?: string;
  onRemovePhrase?: () => void;
  index?: number;
  responseOptions?: Item[];
  field: Record<'id', string>;
}
