import { SelectionOption } from '../ItemConfiguration.types';

export type SelectionOptionProps = SelectionOption & {
  removeOption: () => void;
  index: number;
};
