import { AutocompleteProps } from '@mui/material/Autocomplete/Autocomplete';

import { ParticipantSnippetInfo } from 'modules/Dashboard/components/ParticipantSnippet';

export type ParticipantDropdownOption = ParticipantSnippetInfo & {
  id: string;
};

export type LabeledUserDropdownProps = Omit<
  AutocompleteProps<ParticipantDropdownOption, false, false, false>,
  'value' | 'onChange' | 'fullWidth' | 'options' | 'renderInput'
> & {
  label: string;
  name: string;
  tooltip: string;
  placeholder: string;
  options: ParticipantDropdownOption[];
  value: ParticipantDropdownOption | null;
  onChange: (option: ParticipantDropdownOption | null) => void;
  handleSearch?: (
    search: string,
  ) => ParticipantDropdownOption[] | Promise<ParticipantDropdownOption[]>;
  debounce?: number;
  'data-testid'?: string;
};
