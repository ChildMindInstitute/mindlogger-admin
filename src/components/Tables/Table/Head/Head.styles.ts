import { styled, TableHead, TableCell } from '@mui/material';
import { UiType } from 'components/Tables/Table/Table.types';
import { variables } from 'styles/variables';

import { shouldForwardProp } from 'utils/shouldForwardProp';

const HEAD_ROW_HEIGHT = '5.3rem';

export const StyledTableHead = styled(TableHead, shouldForwardProp)`
  .MuiTableCell-root {
    ${({ uiType }: { uiType?: UiType }) =>
      uiType === UiType.secondary && `background-color: ${variables.palette.surface3}`};
  }
`;

export const StyledTableCell = styled(TableCell, shouldForwardProp)`
  top: ${({ uiType }: { uiType?: UiType }) => (uiType === UiType.secondary ? 0 : HEAD_ROW_HEIGHT)};
`;
