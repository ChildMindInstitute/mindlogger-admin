import { Box, styled } from '@mui/material';

import { StyledFlexSpaceBetween, theme, variables } from 'shared/styles';

export const StyledFlowWrapper = styled(Box)`
  &:not(:last-child) {
    border-bottom: ${variables.borderWidth.md} solid ${variables.palette.outline_variant};
  }
`;

export const StyledHeading = styled(StyledFlexSpaceBetween)`
  margin: ${theme.spacing(5, 0)};
`;
