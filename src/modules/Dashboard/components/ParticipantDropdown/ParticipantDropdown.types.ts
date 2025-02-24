import { AutocompleteProps } from '@mui/material/Autocomplete/Autocomplete';

import { ParticipantSnippetInfo } from 'modules/Dashboard/components/ParticipantSnippet';
import { AtLeastOne } from 'shared/types';
import { Roles } from 'shared/consts';

export enum ParticipantDropdownVariant {
  Outlined = 'outlined',
  Full = 'full',
}

export type ParticipantDropdownOption = ParticipantSnippetInfo & {
  /** Subject ID */
  id: string;
  userId?: string | null;
  isTeamMember: boolean;
  roles: Roles[];
};

export type ParticipantDropdownProps = Omit<
  AutocompleteProps<ParticipantDropdownOption, false, false, false>,
  'value' | 'onChange' | 'fullWidth' | 'options' | 'renderInput'
> & {
  name?: string;
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
  emptyValueError?: string;
  /** @default ParticipantDropdownVariant.Outlined */
  variant?: ParticipantDropdownVariant;
};

export type SearchResultUserTypes = AtLeastOne<{
  team?: boolean;
  fullParticipant?: boolean;
  limitedParticipant?: boolean;
  pendingInvitedParticipant?: boolean;
  anonymousParticipant?: boolean;
}>;

export type UseParticipantDropdownProps = {
  appletId?: string;
  includePendingAccounts?: boolean;
  skip?: boolean;
};
