import {
  AutocompleteOwnerState,
  AutocompleteProps,
  AutocompleteRenderOptionState,
} from '@mui/material';
import { TextFieldProps } from '@mui/material/TextField';
import { FieldValues, UseControllerProps } from 'react-hook-form';

export type AutocompleteOption = {
  label: string;
  id: string;
};

export type FormAutocompleteProps<Value> = Pick<
  AutocompleteProps<Value, true, false, false>,
  'limitTags' | 'noOptionsText' | 'renderOption' | 'disabled'
> & {
  options: Value[];
  labelAllSelect?: string;
  limitTagRows?: number;
  defaultSelectedAll?: boolean;
  onCustomChange?: (options: Value[]) => void;
  renderOption?: (
    option: Value,
    state: AutocompleteRenderOptionState,
    ownerState: AutocompleteOwnerState<Value, true, false, false>,
  ) => React.ReactNode;
  textFieldProps?: TextFieldProps;
  'data-testid'?: string;
};

export type TagsAutocompleteControllerProps<
  FormType extends FieldValues,
  Value extends AutocompleteOption,
> = UseControllerProps<FormType> & FormAutocompleteProps<Value>;
