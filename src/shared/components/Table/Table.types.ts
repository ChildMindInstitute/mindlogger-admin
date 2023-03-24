import { ReactNode } from 'react';

import { Cell, HeadCell } from 'shared/types/table';

export type RowContent = Cell & {
  content: (item: Row) => ReactNode | string;
  value: string | number | boolean;
  onClick?: () => void;
};

export type Row = {
  [name: string]: RowContent;
};

export enum UiType {
  Primary = 'primary',
  Secondary = 'secondary',
  Tertiary = 'tertiary',
}

export type TableProps = {
  columns: HeadCell[];
  rows: Row[] | undefined;
  orderBy: string;
  maxHeight?: string;
  uiType?: UiType;
  showEmptyTable?: boolean;
  emptyComponent?: JSX.Element | string;
  className?: string;
};
