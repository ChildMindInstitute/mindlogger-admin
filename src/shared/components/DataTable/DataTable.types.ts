import { ReactNode } from 'react';
import { DefaultTFuncReturn } from 'i18next';
import { SxProps } from '@mui/material';

import { TooltipProps } from 'shared/components/Tooltip';

export type DataTableItem = Record<string, TooltipProps['tooltipTitle']> & {
  id: string;
  name?: string;
  label?: string;
};

export type DataTableColumn = {
  key: string;
  label?: string | DefaultTFuncReturn | JSX.Element;
  styles?: SxProps;
};

export type DataTableProps = {
  columns: DataTableColumn[];
  data?: DataTableItem[];
  selectable?: boolean;
  selectAll?: boolean;
  selectKey?: string | number;
  selectedItems?: (string | number)[];
  noDataPlaceholder?: ReactNode;
  onSelect?: (key: unknown, prevSelected: boolean) => unknown[] | void;
  onSelectAll?: (allSelected: boolean) => unknown[] | void;
  hasError?: boolean;
  isValueName?: boolean;
  tableHeadBackground?: string;
  'data-testid'?: string;
};
