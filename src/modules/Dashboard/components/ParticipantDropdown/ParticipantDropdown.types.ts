import { AutocompleteProps } from '@mui/material/Autocomplete/Autocomplete';

import { ParticipantSnippetInfo } from 'modules/Dashboard/components/ParticipantSnippet';

export type ParticipantDropdownOption = ParticipantSnippetInfo & {
  /** Subject ID */
  id: string;
  userId?: string | null;
  isTeamMember: boolean;
};

export type ParticipantDropdownProps = Omit<
  AutocompleteProps<ParticipantDropdownOption, false, false, false>,
  'value' | 'onChange' | 'fullWidth' | 'options' | 'renderInput'
> & {
  name: string;
  placeholder: string;
  options: ParticipantDropdownOption[];
  value: ParticipantDropdownOption | null;
  onChange: (option: ParticipantDropdownOption | null) => void;
  handleSearch?: (
    search: string,
  ) => ParticipantDropdownOption[] | Promise<ParticipantDropdownOption[]>;
  debounce?: number;
  'data-testid': string;
  showGroups?: boolean;
};

export type AnyTeamSearchType = 'team' | 'any-participant';
export type FullTeamSearchType = 'team' | 'full-participant';

export type UseParticipantDropdownProps = {
  appletId?: string;
  skip?: boolean;
};
