import { Box, styled } from '@mui/material';

import { StyledFlexAllCenter } from 'styles/styledComponents/Flex';
import theme from 'styles/theme';
import { variables } from 'styles/variables';

export const StyledEmptyTable = styled(StyledFlexAllCenter)`
  flex-direction: column;
  width: 38.1rem;
  height: 100%;
  text-align: center;
  color: ${variables.palette.on_surface};
  margin: 0 auto;
  padding: ${theme.spacing(2.4, 0)};

  svg {
    fill: ${variables.palette.primary};
  }
`;

export const StyledIcon = styled(Box)`
  display: flex;
  padding: ${theme.spacing(1.6)};
  border: ${variables.borderWidth.md} solid ${variables.palette.surface_variant};
  border-radius: ${variables.borderRadius.half};
  margin-bottom: ${theme.spacing(1.6)};
`;
