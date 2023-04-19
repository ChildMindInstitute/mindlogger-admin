import { ReactNode } from 'react';
import { DefaultTFuncReturn } from 'i18next';
import { SxProps } from '@mui/material';

export type DataTableItem = Record<string, unknown> & {
  id: string | number;
};

export type DataTableColumn = {
  key: string;
  label?: string | DefaultTFuncReturn | JSX.Element;
  formatter?: (key: string, value: unknown, item: DataTableItem) => ReactNode;
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
  styles?: SxProps;
};
