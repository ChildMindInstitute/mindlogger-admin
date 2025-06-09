import { styled, TableContainer } from '@mui/material';

import { StyledFlexTopCenter, variables } from 'shared/styles';
import { shouldForwardProp } from 'shared/utils/shouldForwardProp';

import { UiType } from './Table.types';

export const StyledTableContainer = styled(TableContainer, shouldForwardProp)`
  height: 100%;
  max-height: ${({
    maxHeight,
  }: {
    maxHeight: string;
    uiType: UiType;
    hasColFixedWidth?: boolean;
  }) => maxHeight};
  border-radius: ${variables.borderRadius.lg2};

  ${({ hasColFixedWidth }) =>
    hasColFixedWidth &&
    `
    .MuiTableRow-root {
      display: flex;
    }
  `};

  ${({ uiType }) => {
    if (uiType === UiType.Secondary || uiType === UiType.Tertiary) {
      return `
        border-color: ${variables.palette.outline_variant};
        
        & .MuiTableCell-root {
          background-color: transparent;
          border-color: ${variables.palette.outline_variant};
        }
        
        & .MuiTableBody-root .MuiTableRow-root:hover {
          background-color: transparent;
        }
      `;
    }

    if (uiType === UiType.Quaternary) {
      return ` 
        & .MuiTableCell-root {
          background-color: transparent;
        }
        
        & .MuiTableBody-root .MuiTableRow-root:hover {
          background-color: transparent;
        }
      `;
    }
  }}

  ${({ uiType }) =>
    (uiType === UiType.Tertiary || uiType === UiType.Quaternary) &&
    `
    & .MuiTableCell-root {
      cursor: default;
      font-size: ${variables.font.size.label3};
      line-height: ${variables.font.lineHeight.label3};
      letter-spacing: ${variables.font.letterSpacing.lg};
    }
  `}
`;

export const StyledTableCellContent = styled(StyledFlexTopCenter, shouldForwardProp)`
  justify-content: ${({ uiType }: { uiType: UiType }) =>
    uiType === UiType.Primary || uiType === UiType.Quaternary ? 'flex-end' : 'flex-start'};

  & .MuiTablePagination-displayedRows {
    color: ${({ uiType }) => uiType === UiType.Tertiary && variables.palette.outline};
  }
`;
