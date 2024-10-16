import { styled } from '@mui/material';

import { DashboardTable } from 'modules/Dashboard/components';
import { theme, variables } from 'shared/styles';

export const StyledDashboardTable = styled(DashboardTable)`
  border: 0;
  border-radius: 0;

  .MuiTable-root {
    padding-top: ${theme.spacing(1.2)};
    border-top: ${variables.borderWidth.md} solid ${variables.palette.surface_variant};
  }

  && {
    .MuiTable-root,
    .MuiTableHead-root,
    .MuiTableCell-root {
      background-color: ${variables.palette.surface};
    }

    .MuiTableHead-root tr th:first-of-type,
    td.MuiTableCell-root:first-of-type {
      min-width: 28rem;
      padding-left: ${theme.spacing(1.6)};
    }
  }
`;
