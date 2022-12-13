import { Box, styled, TableContainer } from '@mui/material';

import { StyledFlexTopCenter } from 'styles/styledComponents/Flex';
import { variables } from 'styles/variables';

const draggedBorder = `0.3rem solid ${variables.palette.primary}`;
const draggedBorderRadius = '0.4rem 0.4rem';

export const StyledTableContainer = styled(TableContainer)`
  display: flex;
  flex-direction: column;

  .MuiTableRow-root.dragged-over {
    .MuiTableCell-body {
      border-top: ${draggedBorder};
      border-bottom: ${draggedBorder};
    }
    .MuiTableCell-body:first-of-type {
      border-left: ${draggedBorder};
      border-top-left-radius: ${draggedBorderRadius};
      border-bottom-left-radius: ${draggedBorderRadius};
    }
    .MuiTableCell-body:last-of-type {
      border-right: ${draggedBorder};
      border-top-right-radius: ${draggedBorderRadius};
      border-bottom-right-radius: ${draggedBorderRadius};
    }
  }
`;

export const StyledTableCellContent = styled(Box)`
  display: flex;
  justify-content: space-between;
`;

export const StyledCellItem = styled(StyledFlexTopCenter)`
  cursor: pointer;
`;
