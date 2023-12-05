import { ReactNode } from 'react';

import { Cell, HeadCell } from 'shared/types/table';

export type RowContent = Cell & {
  content: (item?: Row, hasVisibleActions?: boolean) => ReactNode;
  value: string | number | boolean;
  onClick?: () => void;
  width?: string;
};

export type Row = {
  [name: string]: RowContent;
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
  orderBy: string;
  maxHeight?: string;
  uiType?: UiType;
  emptyComponent?: JSX.Element | string;
  className?: string;
  'data-testid'?: string;
};
