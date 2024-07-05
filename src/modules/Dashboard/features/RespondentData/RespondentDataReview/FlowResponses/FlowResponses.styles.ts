import { Box, styled } from '@mui/material';

import { variables, theme } from 'shared/styles';

export const StyledWrapper = styled(Box)`
  margin: ${theme.spacing(0, 6, 6)};

  &:not(:last-of-type) {
    border-bottom: ${`${variables.borderWidth.md} solid ${variables.palette.outline_variant}`};
  }
`;
