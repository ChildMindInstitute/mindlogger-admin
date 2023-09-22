import { styled, TableCell, TableHead } from '@mui/material';

import { variables } from 'shared/styles/variables';
import { shouldForwardProp } from 'shared/utils/shouldForwardProp';

import { UiType } from '../Table.types';

const HEAD_ROW_HEIGHT = '5.3rem';

export const StyledTableHead = styled(TableHead, shouldForwardProp)`
  display: block;

  .MuiTableCell-root {
    ${({ uiType }: { uiType?: UiType }) => {
      if (uiType === UiType.Secondary || uiType === UiType.Tertiary) {
        return `background-color: ${variables.palette.surface3}`;
      }

      if (uiType === UiType.Quaternary) {
        return `background-color: ${variables.palette.surface1}`;
      }

      return `background-color: ${variables.palette.surface}`;
    }};
  }
`;

export const StyledTableCell = styled(TableCell, shouldForwardProp)`
  top: ${({ uiType }: { uiType?: UiType; width?: string }) =>
    uiType === UiType.Secondary || uiType === UiType.Tertiary ? 0 : HEAD_ROW_HEIGHT};
  display: flex;
  align-items: center;
  flex-basis: ${({ width }) => width};
  flex-grow: ${({ width }) => (width ? 'unset' : 1)};

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
