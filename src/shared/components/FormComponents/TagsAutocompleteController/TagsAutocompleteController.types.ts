import { TextFieldProps } from '@mui/material/TextField';
import { FieldValues, UseControllerProps } from 'react-hook-form';

export type AutocompleteOption = {
  label: string;
  id: string;
};

export type FormAutocompleteProps = {
  options: AutocompleteOption[] | undefined;
  labelAllSelect?: string;
  noOptionsText?: string;
  limitTags?: number;
  defaultSelectedAll?: boolean;
  'data-testid'?: string;
} & TextFieldProps;

export type TagsAutocompleteControllerProps<T extends FieldValues> = FormAutocompleteProps &
  UseControllerProps<T>;
