import { styled, TableCell, TableHead } from '@mui/material';

import { theme } from 'shared/styles/theme';
import { variables } from 'shared/styles/variables';
import { shouldForwardProp } from 'shared/utils/shouldForwardProp';

import { UiType } from '../Table.types';

const HEAD_ROW_HEIGHT = '5.3rem';

export const StyledTableHead = styled(TableHead, shouldForwardProp)`
  top: 0;
  position: sticky;
  z-index: ${theme.zIndex.fab};

  ${({ hasColFixedWidth }: { hasColFixedWidth?: boolean; uiType?: UiType; tableHeadBg?: string }) =>
    hasColFixedWidth &&
    `
    display: block;
    background-color: ${variables.palette.surface};
  `};

  && {
    .MuiTableCell-root {
      ${({ uiType, tableHeadBg }) => {
        if (uiType === UiType.Secondary || uiType === UiType.Tertiary) {
          return `background-color: ${tableHeadBg || variables.palette.surface3}`;
        }

        if (uiType === UiType.Quaternary) {
          return `background-color: ${tableHeadBg || variables.palette.surface1}`;
        }

        return `background-color: ${tableHeadBg || variables.palette.surface}`;
      }};
    }
  }
`;

export const StyledTableCell = styled(TableCell, shouldForwardProp)`
  top: ${({ uiType }: { uiType?: UiType; width?: string; hasColFixedWidth?: boolean }) =>
    uiType === UiType.Secondary || uiType === UiType.Tertiary ? 0 : HEAD_ROW_HEIGHT};

  ${({ hasColFixedWidth, width }) => {
    if (hasColFixedWidth) {
      return `
        display: flex;
        align-items: center;
        flex-basis: ${width ?? 'auto'};
        flex-grow: ${width ? 'unset' : 1};
      `;
    }

    return `
      height: 4.8rem;
    `;
  }};

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
