import {
  ParticipantDropdown,
  ParticipantDropdownVariant,
  ParticipantSnippet,
} from 'modules/Dashboard/components';
import { StyledFlexTopCenter } from 'shared/styles';

import { AssignmentDropdownProps } from './AssignmentsTable.types';

export const AssignmentDropdown = ({ isReadOnly, value, ...rest }: AssignmentDropdownProps) => (
  <StyledFlexTopCenter sx={{ height: '100%' }}>
    {isReadOnly ? (
      <ParticipantSnippet
        {...value}
        hasLimitedAccountIcon={!!value && !value.userId}
        boxProps={{ sx: { px: 3.2, py: 0.8, maxWidth: '100%' } }}
      />
    ) : (
      <ParticipantDropdown
        value={value}
        sx={{ mr: 'auto' }}
        variant={ParticipantDropdownVariant.Full}
        {...rest}
      />
    )}
  </StyledFlexTopCenter>
);
