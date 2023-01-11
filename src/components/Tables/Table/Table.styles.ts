import { styled, TableContainer } from '@mui/material';

import { StyledFlexTopCenter } from 'styles/styledComponents/Flex';
import { variables } from 'styles/variables';
import { shouldForwardProp } from 'utils/shouldForwardProp';

import { UiType } from './Table.types';

export const StyledTableContainer = styled(TableContainer, shouldForwardProp)`
  height: ${({ height }: { height: string; uiType: UiType }) => height || 'auto'};
  ${({ uiType }) =>
    uiType === UiType.secondary &&
    `
    border-color: ${variables.palette.outline_variant};
    
    & .MuiTableCell-root {
      background-color: transparent;
      border-color: ${variables.palette.outline_variant};
    }
    
    & .MuiTableBody-root .MuiTableRow-root:hover {
      background-color: transparent;
    }
  `}
`;

export const StyledTableCellContent = styled(StyledFlexTopCenter)`
  justify-content: flex-end;
`;
