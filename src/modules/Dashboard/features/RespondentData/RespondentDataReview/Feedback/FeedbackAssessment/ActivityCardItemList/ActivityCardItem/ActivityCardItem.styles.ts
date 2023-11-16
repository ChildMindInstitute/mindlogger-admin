import { Box, styled } from '@mui/material';

import { theme, variables } from 'shared/styles';

export const StyledCardItemContainer = styled(Box)`
  padding-bottom: ${theme.spacing(3.2)};

  &:not(:first-of-type) {
    padding-top: ${theme.spacing(3.2)};
    border-top: ${variables.borderWidth.md} solid ${variables.palette.surface_variant};
  }
`;
