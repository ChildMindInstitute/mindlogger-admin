import { ReactNode } from 'react';
import { DefaultTFuncReturn } from 'i18next';
import { SxProps } from '@mui/material';

export type DataTableItem = Record<string, unknown> & {
  id: string;
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
  containerStyles?: SxProps;
  tableHeadBgColor?: string;
};
