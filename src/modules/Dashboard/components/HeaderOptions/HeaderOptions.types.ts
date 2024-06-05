import { BoxProps } from '@mui/material';

import { ExportDataFilters } from 'shared/utils';

export interface HeaderOptionsProps extends BoxProps {
  exportFilters?: ExportDataFilters;
}
