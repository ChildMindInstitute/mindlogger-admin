import { styled, TableCell, TableHead } from '@mui/material';

import { variables } from 'styles/variables';
import { shouldForwardProp } from 'utils/shouldForwardProp';

import { UiType } from '../Table.types';

const HEAD_ROW_HEIGHT = '5.3rem';

export const StyledTableHead = styled(TableHead, shouldForwardProp)`
  .MuiTableCell-root {
    ${({ uiType }: { uiType?: UiType }) =>
      (uiType === UiType.Secondary || uiType === UiType.Tertiary) &&
      `background-color: ${variables.palette.surface3}`};
  }
`;

export const StyledTableCell = styled(TableCell, shouldForwardProp)`
  top: ${({ uiType }: { uiType?: UiType }) =>
    uiType === UiType.Secondary || uiType === UiType.Tertiary ? 0 : HEAD_ROW_HEIGHT};

  &.MuiTableCell-head {
    ${({ uiType }) =>
      uiType === UiType.Tertiary &&
      `
    color: ${variables.palette.outline};
    font-size: ${variables.font.size.md};
    line-height: ${variables.font.lineHeight.md};
    letter-spacing: ${variables.font.letterSpacing.lg};
  `}
  }
`;
