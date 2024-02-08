import { styled, Box, Button } from '@mui/material';

import { StyledClearedButton, StyledFlexTopCenter } from 'shared/styles/styledComponents';
import theme from 'shared/styles/theme';
import { variables } from 'shared/styles/variables';

export const StyledToolbar = styled(StyledFlexTopCenter)`
  padding: ${theme.spacing(1.2, 1.6)};
  justify-content: space-between;
`;

export const StyledViewsWrapper = styled(Box)`
  max-width: 41.3rem;
`;

export const StyledIconBtn = styled(StyledClearedButton)`
  svg {
    fill: ${variables.palette.on_surface_variant};
  }

  &:hover {
    svg {
      fill: ${variables.palette.primary};
    }
  }

  &:first-of-type {
    margin-right: ${theme.spacing(2)};
  }

  &:last-of-type {
    margin-left: ${theme.spacing(2)};
  }
`;

export const StyledTodayBtn = styled(Button)`
  height: 3.8rem;
  svg {
    fill: ${variables.palette.primary};
  }
`;
