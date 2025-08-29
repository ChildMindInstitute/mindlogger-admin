import { SxProps } from '@mui/material';
import { ReactNode } from 'react';
import { FieldValues, UseControllerProps } from 'react-hook-form';

import { DataTableColumn, DataTableItem } from 'shared/components/DataTable';

export type TransferListControllerProps<T extends FieldValues> = {
  caption?: ReactNode;
  searchKey?: string | number;
  items?: DataTableItem[];
  selectedItems?: DataTableItem[];
  columns: DataTableColumn[];
  selectedItemsColumns?: DataTableColumn[];
  sxProps?: SxProps;
  readOnly?: boolean;
  hasSearch?: boolean;
  hasSelectedSection?: boolean;
  tableHeadBackground?: string;
  tooltipByDefault?: boolean;
  onChangeSelectedCallback?: (values: string[]) => void;
  useVirtualizedList?: boolean;
  'data-testid'?: string;
} & UseControllerProps<T>;
