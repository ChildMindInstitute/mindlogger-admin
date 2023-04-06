import { styled, TableContainer } from '@mui/material';

import { variables, StyledFlexTopCenter } from 'shared/styles';
import { shouldForwardProp } from 'shared/utils';

import { UiType } from './Table.types';

export const StyledTableContainer = styled(TableContainer, shouldForwardProp)`
  height: 100%;
  max-height: ${({ maxHeight }: { maxHeight: string; uiType: UiType }) => maxHeight};
  border-radius: ${variables.borderRadius.lg2};

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
