import { Box, Button } from '@mui/material';
import { styled } from '@mui/system';

import { StyledFlexAllCenter, theme, variables } from 'shared/styles';

export const StyledContainer = styled(StyledFlexAllCenter)`
  height: calc(100% + 4rem);
  overflow-y: hidden;
  margin: ${theme.spacing(-2.4, -2.4, -1.6)};
`;

export const StyledMenu = styled(Box)`
  display: flex;
  flex-direction: column;
  width: 40rem;
  height: 100%;
  flex-shrink: 0;
  border-right: ${variables.borderWidth.md} solid ${variables.palette.surface_variant};
  padding: ${theme.spacing(4.8, 1.6)};
`;

export const StyledTextBtn = styled(Button)`
  svg {
    fill: ${variables.palette.primary};
  }
`;
