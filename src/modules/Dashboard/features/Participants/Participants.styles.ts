import { Button, styled } from '@mui/material';

import { Search } from 'shared/components';
import { StyledFlexSpaceBetween, StyledFlexTopCenter } from 'shared/styles/styledComponents';
import theme from 'shared/styles/theme';
import { variables } from 'shared/styles/variables';
import { shouldForwardProp } from 'shared/utils/shouldForwardProp';

export const ParticipantsHeader = styled(StyledFlexSpaceBetween, shouldForwardProp)`
  margin-bottom: ${theme.spacing(2.4)};
  min-width: 805px;
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
  min-width: 320px;
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
  min-width: 137px;
`;
