import { styled } from '@mui/system';
import { Box, TablePagination } from '@mui/material';

import theme from 'styles/theme';
import { variables } from 'styles/variables';

export const ContentContainer = styled(Box)`
  padding: ${theme.spacing(4.8, 6.4)};
  overflow-y: auto;
`;

export const StyledAppletList = styled(Box)`
  border: ${variables.borderWidth.md} solid ${variables.palette.surface_variant};
  border-radius: ${variables.borderRadius.lg2};
`;

export const StyledAppletContainer = styled(Box)`
  padding: ${theme.spacing(3.2)};

  &:not(:last-child) {
    border-bottom: ${variables.borderWidth.md} solid ${variables.palette.surface_variant};
  }
`;

export const StyledTablePagination = styled(TablePagination)`
  .MuiTablePagination-toolbar {
    display: flex;
    justify-content: flex-end;
  }

  .MuiTablePagination-displayedRows {
    color: ${variables.palette.outline};
  }
` as typeof TablePagination;
