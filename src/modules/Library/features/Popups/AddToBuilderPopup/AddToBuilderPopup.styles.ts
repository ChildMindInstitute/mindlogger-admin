import { Box, FormControlLabel, styled } from '@mui/material';

import { theme, variables } from 'shared/styles';

export const StyledTableFormControlLabel = styled(FormControlLabel)`
  display: flex;
  justify-content: space-between;
  margin: 0;
`;

export const StyledListFormControlLabel = styled(FormControlLabel)`
  margin: ${theme.spacing(0.6, 0)};
`;

export const StyledContainer = styled(Box)`
  .MuiTableContainer-root {
    &.error {
      border: ${variables.borderWidth.lg} solid ${variables.palette.semantic.error};
    }
  }

  .option-hint {
    display: none;
  }

  .Mui-checked + .MuiTypography-root {
    .option-hint {
      display: flex;
    }
  }
`;
