import { Button, styled } from '@mui/material';

import { DashboardTable } from 'modules/Dashboard/components';
import { Search } from 'shared/components';
import { StyledFlexSpaceBetween, StyledFlexTopCenter } from 'shared/styles/styledComponents';
import theme from 'shared/styles/theme';
import { variables } from 'shared/styles/variables';
import { shouldForwardProp } from 'shared/utils/shouldForwardProp';

import { ParticipantsColumnsWidth } from './Participants.const';

export const ParticipantsHeader = styled(StyledFlexSpaceBetween, shouldForwardProp)`
  margin-bottom: ${theme.spacing(2.4)};
  min-width: 80.5rem;
  font-size: ${variables.font.size.lg};
`;

export const HeaderSectionLeft = styled(StyledFlexTopCenter, shouldForwardProp)`
  gap: ${theme.spacing(1.2)};
  width: 50%;
`;

export const HeaderSectionRight = styled(StyledFlexTopCenter, shouldForwardProp)`
  gap: ${theme.spacing(1.2)};
  width: 50%;
  justify-content: flex-end;
`;

export const ParticipantSearchButton = styled(Search)`
  flex: 0 0 50%;
  min-width: 32rem;
`;

export const StyledButton = styled(Button)`
  && {
    svg {
      fill: ${variables.palette.on_surface_variant};
    }
  }
`;

export const FiltersButton = styled(StyledButton)`
  color: ${variables.palette.on_surface_variant};
`;

export const SortByButton = styled(StyledButton)`
  color: ${variables.palette.on_surface_variant};
`;

export const AddParticipantButton = styled(StyledButton)`
  min-width: 13.7rem;
`;

export const ParticipantsTable = styled(DashboardTable)`
  td,
  th {
    min-width: 13rem;
  }

  th:nth-child(1),
  td:nth-child(1) {
    min-width: ${ParticipantsColumnsWidth.Pin};
  }

  th:nth-child(2),
  td:nth-child(2) {
    min-width: ${ParticipantsColumnsWidth.Pin};
  }

  th:nth-child(6),
  td:nth-child(6) {
    min-width: ${ParticipantsColumnsWidth.AccountType};
  }

  th:last-child,
  td:last-child {
    min-width: ${ParticipantsColumnsWidth.Menu};
  }
`;
