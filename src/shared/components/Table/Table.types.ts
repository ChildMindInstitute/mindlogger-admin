import { ReactNode } from 'react';

import { Cell, HeadCell } from 'shared/types/table';

export type CellContent = Cell & {
  content?: (item?: Row) => ReactNode;
  value: string | number | boolean;
  onClick?: () => void;
  maxWidth?: string;
  width?: string;
  contentWithTooltip?: ReactNode;
  isHidden?: boolean;
};

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
  orderBy: string;
  maxHeight?: string;
  uiType?: UiType;
  emptyComponent?: JSX.Element | string;
  className?: string;
  tableHeadBg?: string;
  'data-testid'?: string;
};
