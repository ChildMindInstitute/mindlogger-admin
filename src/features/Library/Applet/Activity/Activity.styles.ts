import { styled } from '@mui/system';
import { Box, FormControlLabel } from '@mui/material';

import { variables } from 'styles/variables';
import theme from 'styles/theme';

export const StyledActivityContainer = styled(Box)`
  display: grid;
  grid-template-columns: 4.8rem auto;
  align-items: start;
  background: ${variables.palette.surface1};
  border-radius: ${variables.borderRadius.lg};
  padding: ${theme.spacing(0.6, 2)};

  &:not(:last-child) {
    margin-bottom: ${theme.spacing(0.8)};
  }
`;

export const StyledActivityHeader = styled(Box)`
  display: grid;
  grid-template-columns: 4.8rem auto;
  cursor: pointer;
`;

export const StyledFormControlLabel = styled(FormControlLabel)`
  margin: 0;
`;

export const StyledNavigateSvg = styled(Box)`
  display: flex;
  justify-content: center;
  padding: ${theme.spacing(0.9, 0)};

  svg {
    fill: ${variables.palette.on_surface_variant};
  }
`;

export const StyledItemsList = styled(Box)`
  grid-column-start: 2;
  border: ${variables.borderWidth.md} solid ${variables.palette.outline_variant};
  border-radius: ${variables.borderRadius.lg2};
  margin: ${theme.spacing(1.8, 0, 1.8, 4.8)};
`;
