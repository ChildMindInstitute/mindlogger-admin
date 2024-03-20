import { SxProps } from '@mui/material';

import { DataTableItem } from 'shared/components/DataTable';
import { TooltipProps } from 'shared/components/Tooltip';

export type ContentWithTooltipProps = {
  value: TooltipProps['tooltipTitle'];
  item: DataTableItem;
  styles?: SxProps;
  tooltipByDefault?: boolean;
  'data-testid'?: string;
};
