import { Box, styled, TableContainer } from '@mui/material';

import { StyledFlexTopCenter } from 'styles/styledComponents/Flex';

export const StyledTableContainer = styled(TableContainer)`
  display: flex;
  flex-direction: column;
`;

export const StyledTableCellContent = styled(Box)`
  display: flex;
  justify-content: space-between;
`;

export const StyledCellItem = styled(StyledFlexTopCenter)`
  cursor: pointer;
`;
