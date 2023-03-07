import { styled, TableContainer } from '@mui/material';

import { StyledFlexTopCenter } from 'shared/styles/styledComponents';
import { variables } from 'shared/styles/variables';
import { shouldForwardProp } from 'shared/utils/shouldForwardProp';

import { UiType } from './Table.types';

export const StyledTableContainer = styled(TableContainer, shouldForwardProp)`
  height: ${({ height }: { height: string; uiType: UiType }) => height};

  ${({ uiType }) =>
    (uiType === UiType.Secondary || uiType === UiType.Tertiary) &&
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
    uiType === UiType.Tertiary &&
    `
    & .MuiTableCell-root {
      cursor: default;
      font-size: ${variables.font.size.md};
      line-height: ${variables.font.lineHeight.md};
      letter-spacing: ${variables.font.letterSpacing.lg};
    }
  `}
`;

export const StyledTableCellContent = styled(StyledFlexTopCenter, shouldForwardProp)`
  justify-content: ${({ uiType }: { uiType: UiType }) =>
    uiType === UiType.Primary ? 'flex-end' : 'flex-start'};

  & .MuiTablePagination-displayedRows {
    color: ${({ uiType }) => uiType === UiType.Tertiary && variables.palette.outline};
  }
`;
