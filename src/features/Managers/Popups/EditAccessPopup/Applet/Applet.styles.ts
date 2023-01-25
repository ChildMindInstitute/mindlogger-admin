import { styled } from '@mui/system';
import { Box, Link } from '@mui/material';

import theme from 'styles/theme';
import { StyledFlexTopCenter } from 'styles/styledComponents/Flex';
import { variables } from 'styles/variables';

export const StyledApplet = styled(Box)`
  padding: ${theme.spacing(1.6)};
  border-radius: ${variables.borderRadius.lg2};
  margin-bottom: ${theme.spacing(1.2)};
  background-color: ${variables.palette.surface5};

  .MuiChip-root > svg {
    margin-right: ${theme.spacing(0.9)};
    fill: ${variables.palette.primary};
  }
`;

export const StyledRow = styled(StyledFlexTopCenter)`
  justify-content: space-between;
`;

export const StyledBtn = styled(Link)`
  cursor: pointer;
  color: ${variables.palette.on_surface_variant};
  text-decoration-color: ${variables.palette.on_surface_variant};
`;

export const StyledLabel = styled(Box)`
  text-transform: capitalize;
`;

export const StyledImg = styled('img')`
  max-width: 4rem;
`;
