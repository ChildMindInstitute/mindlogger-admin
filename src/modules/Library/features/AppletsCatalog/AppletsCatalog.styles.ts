import { styled } from '@mui/system';
import { TablePagination } from '@mui/material';

import { variables } from 'styles/variables';

export const StyledTablePagination = styled(TablePagination)`
  overflow: visible;

  .MuiTablePagination-toolbar {
    display: flex;
    justify-content: flex-end;
  }

  .MuiTablePagination-displayedRows {
    color: ${variables.palette.outline};
  }
` as typeof TablePagination;
