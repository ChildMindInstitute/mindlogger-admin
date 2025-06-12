import { Box, styled } from '@mui/material';

import { theme, variables } from 'shared/styles';

export const StyledController = styled(Box)`
  width: 40rem;
  margin-top: ${theme.spacing(2.4)};

  .MuiFormHelperText-root.Mui-error {
    color: ${variables.palette.error};
  }
`;
