import { SingleAndMultipleSelectRowsResponseValues } from 'shared/state/Applet';
import {
  DecryptedMultiSelectionPerRowAnswer,
  DecryptedSingleSelectionPerRowAnswer,
} from 'shared/types';

export type ItemRowsProps = {
  responseValues: SingleAndMultipleSelectRowsResponseValues;
  answer: DecryptedSingleSelectionPerRowAnswer | DecryptedMultiSelectionPerRowAnswer | null;
  isMultiple?: boolean;
  'data-testid'?: string;
};
