import { StyledLabelLarge } from 'shared/styles';

import { DataTableColumn } from './DataTable.types';

export const defaultFormatter: DataTableColumn['formatter'] = (_, value) => (
  <StyledLabelLarge>
    <>{value}</>
  </StyledLabelLarge>
);

export const getColumns = (columns: DataTableColumn[]) =>
  columns?.map((column) => ({ formatter: defaultFormatter, ...column }));
