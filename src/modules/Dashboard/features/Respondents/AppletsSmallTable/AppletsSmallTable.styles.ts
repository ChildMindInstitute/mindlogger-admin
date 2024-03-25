import { styled } from '@mui/material';

import { Table } from 'shared/components/Table';
import { tableRowHoverColor } from 'shared/utils/colors';

export const StyledTable = styled(Table)`
  .MuiTableBody-root .MuiTableRow-root {
    cursor: pointer;

    &:hover {
      background-color: ${tableRowHoverColor};
    }
  }
`;
