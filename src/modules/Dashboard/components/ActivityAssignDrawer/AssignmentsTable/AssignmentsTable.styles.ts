import { styled } from '@mui/material';

import { DashboardTable } from 'modules/Dashboard/components/DashboardTable';
import { StyledFlexColumn, theme, variables } from 'shared/styles';

export const StyledTable = styled(DashboardTable)`
  .MuiTable-root {
    table-layout: fixed;
  }
  .MuiTableCell-head:not(:empty) {
    padding: ${theme.spacing(2.2, 3.2, 1.4)} !important;
  }
  .MuiTableCell-root {
    padding: 0 !important;
  }
  .MuiTableCell-root:not(:last-child) {
    border-right: ${variables.borderWidth.md} solid ${variables.palette.surface_variant};
  }
`;

export const StyledTableContainer = styled(StyledFlexColumn)`
  align-items: flex-start;
  gap: ${theme.spacing(0.4)};
  padding: ${theme.spacing(6, 0)}; /* Extend hover coverage */
  margin: ${theme.spacing(-6, 0)};

  & > .MuiButton-root {
    transition: ${variables.transitions.opacity};
    pointer-events: none;
    opacity: 0;
  }

  &:hover > .MuiButton-root,
  .MuiButton-root:focus {
    pointer-events: auto;
    opacity: 1;
  }
`;
