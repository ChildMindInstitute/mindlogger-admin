import { SelectionOption } from '../../ItemConfiguration.types';

export type SelectionOptionProps = SelectionOption & {
  onRemoveOption: (index: number) => void;
  index: number;
};
