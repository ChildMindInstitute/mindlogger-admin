import { Box, FormControlLabel, styled } from '@mui/material';

import { theme, variables } from 'shared/styles';
import { Table } from 'shared/components';
import { tableRowHoverColor } from 'shared/utils/colors';

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

export const StyledTable = styled(Table)`
  .MuiTableBody-root .MuiTableRow-root {
    &:hover {
      background-color: ${tableRowHoverColor};
    }
  }
`;
