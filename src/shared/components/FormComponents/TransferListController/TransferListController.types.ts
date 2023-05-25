import { ReactNode } from 'react';
import { FieldValues, UseControllerProps } from 'react-hook-form';
import { SxProps } from '@mui/material';

import { DataTableItem, DataTableColumn } from 'shared/components/DataTable';

export type TransferListControllerProps<T extends FieldValues> = {
  caption?: ReactNode;
  searchKey?: string | number;
  items?: DataTableItem[];
  selectedItems?: DataTableItem[];
  columns: DataTableColumn[];
  readOnly?: boolean;
  hasSearch?: boolean;
  hasSelectedSection?: boolean;
  leftTableStyles?: SxProps;
} & UseControllerProps<T>;
