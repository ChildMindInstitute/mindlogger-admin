import { TextFieldProps } from '@mui/material/TextField';
import { FieldValues, UseControllerProps } from 'react-hook-form';

export type TagsControllerProps = {
  tags: string[];
  onAddTagClick: (value: string) => void;
  onRemoveTagClick: (index: number) => void;
  uiType?: UiType;
  inputLabel?: string;
  disable?: boolean;
} & TextFieldProps;

export type TagsInputControllerProps<T extends FieldValues> = TagsControllerProps & UseControllerProps<T>;

export enum UiType {
  Primary = 'primary',
  Secondary = 'secondary',
}
