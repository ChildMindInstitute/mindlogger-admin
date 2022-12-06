import { Box, styled, TableContainer } from '@mui/material';

import { StyledFlexTopCenter } from 'styles/styledComponents/Flex';
import { FOOTER_HEIGHT, SEARCH_HEIGHT, TABS_HEIGHT, TOP_BAR_HEIGHT } from 'utils/constants';

export const StyledTableContainer = styled(TableContainer)`
  height: calc(
    100vh - ${TOP_BAR_HEIGHT} - ${FOOTER_HEIGHT} - ${TABS_HEIGHT} - ${SEARCH_HEIGHT} - 6.4rem
  );
`;

export const StyledTableCellContent = styled(Box)`
  display: flex;
  justify-content: space-between;
`;

export const StyledCellItem = styled(StyledFlexTopCenter)`
  cursor: pointer;
`;
