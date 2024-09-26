import { styled } from '@mui/material';

import { DashboardTable } from 'modules/Dashboard/components/DashboardTable';
import { theme, variables } from 'shared/styles';

export const StyledTable = styled(DashboardTable)`
  .MuiTableCell-head:not(:empty) {
    padding: ${theme.spacing(2.2, 3.2, 1.4)} !important;
  }
  .MuiTableCell-root {
    padding: 0 !important;
  }
  .MuiTableCell-root:not(:last-of-type):not(:first-of-type) {
    border-right: ${variables.borderWidth.md} solid ${variables.palette.surface_variant};
  }

  th:first-of-type,
  td:first-of-type {
    min-width: 4.8rem;
  }
`;
