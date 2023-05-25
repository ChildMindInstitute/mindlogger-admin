import { SxProps } from '@mui/material';

import { DataTableItem } from 'shared/components/DataTable';

export type ContentWithTooltipProps = {
  value: unknown;
  item: DataTableItem;
  styles?: SxProps;
};
