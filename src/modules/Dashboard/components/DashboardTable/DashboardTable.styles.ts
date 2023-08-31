import { styled, TableCell } from '@mui/material';

import { variables } from 'shared/styles';

export const StyledTableCell = styled(TableCell)`
  font-size: ${variables.font.size.md};
  line-height: ${variables.font.lineHeight.md};
  letter-spacing: ${variables.font.letterSpacing.sm};
`;
