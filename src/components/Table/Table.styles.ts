import { styled, TableContainer } from '@mui/material';

import { StyledFlexTopCenter } from 'styles/styledComponents/Flex';
import { variables } from 'styles/variables';
import { shouldForwardProp } from 'utils/shouldForwardProp';

import { UiType } from './Table.types';

export const StyledTableContainer = styled(TableContainer, shouldForwardProp)`
  height: ${({ height }: { height: string; uiType: UiType }) => height};

  ${({ uiType }) =>
    (uiType === UiType.secondary || uiType === UiType.tertiary) &&
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

  ${({ uiType }) =>
    uiType === UiType.tertiary &&
    `
    & .MuiTableCell-root {
      cursor: default;
      font-size: ${variables.font.size.md};
      line-height: ${variables.lineHeight.md};
      letter-spacing: ${variables.letterSpacing.lg};
    }
  `}
`;

export const StyledTableCellContent = styled(StyledFlexTopCenter, shouldForwardProp)`
  justify-content: ${({ uiType }: { uiType: UiType }) =>
    uiType === UiType.primary ? 'flex-end' : 'flex-start'};

  & .MuiTablePagination-displayedRows {
    color: ${({ uiType }) => uiType === UiType.tertiary && variables.palette.outline};
  }
`;
