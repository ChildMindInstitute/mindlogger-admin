import { TableCellProps } from '@mui/material';
import { ReactNode } from 'react';

import { Cell, HeadCell, Order } from 'shared/types/table';

export interface CellContent extends Omit<TableCellProps, 'content'>, Cell {
  content?: (item?: Row) => ReactNode;
  contentWithTooltip?: ReactNode;
  isHidden?: boolean;
  maxWidth?: string;
  value: string | number | boolean;
  width?: string;
}

export type Row = {
  [name: string]: CellContent;
};

export enum UiType {
  Primary = 'primary',
  Secondary = 'secondary',
  Tertiary = 'tertiary',
  Quaternary = 'quaternary',
}

export type TableProps = {
  columns: HeadCell[];
  rows: Row[] | undefined;
  keyExtractor?: (row: Row, index: number) => string;
  order?: Order;
  orderBy: string;
  maxHeight?: string;
  uiType?: UiType;
  emptyComponent?: JSX.Element | string;
  className?: string;
  tableHeadBg?: string;
  'data-testid'?: string;
};
