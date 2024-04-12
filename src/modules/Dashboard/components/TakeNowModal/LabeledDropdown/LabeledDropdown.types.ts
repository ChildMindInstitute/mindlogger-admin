import { AutocompleteProps } from '@mui/material/Autocomplete/Autocomplete';

import { AutocompleteOption } from 'shared/components/FormComponents';

export type Option = {
  value: string;
  labelKey: string;
};

export type LabeledDropdownProps = Omit<
  AutocompleteProps<AutocompleteOption, false, false, false>,
  'value' | 'onChange' | 'fullWidth' | 'options' | 'renderInput'
> & {
  label: string;
  name: string;
  tooltip: string;
  placeholder: string;
  options: AutocompleteOption[];
  value: AutocompleteOption | null;
  onChange: (option: AutocompleteOption | null) => void;
  handleSearch?: (search: string) => AutocompleteOption[] | Promise<AutocompleteOption[]>;
  debounce?: number;
  'data-testid'?: string;
};
