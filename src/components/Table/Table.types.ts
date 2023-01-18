import { ReactNode } from 'react';

import { Cell, HeadCell } from 'types/table';

export type RowContent = Cell & {
  content: (item: Row) => ReactNode | string;
  value: string | number | boolean;
  onClick?: () => void;
};

export type Row = {
  [name: string]: RowContent;
};

export enum UiType {
  primary = 'primary',
  secondary = 'secondary',
  tertiary = 'tertiary',
}

export type TableProps = {
  columns: HeadCell[];
  rows: Row[] | undefined;
  orderBy: string;
  tableHeight?: string;
  uiType?: UiType;
};
