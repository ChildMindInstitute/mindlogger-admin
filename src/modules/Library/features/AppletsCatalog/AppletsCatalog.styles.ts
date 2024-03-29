import { styled, TablePagination } from '@mui/material';

import { variables } from 'shared/styles';

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
