import { Cell, HeadCell } from 'types/table';

export type RowContent = Cell & {
  content: (item: Row) => React.ReactNode | string;
  value: string | number;
  onClick?: () => void;
};

export type Row = {
  [name: string]: RowContent;
};

export enum UiType {
  primary = 'primary',
  secondary = 'secondary',
}

export type TableProps = {
  tableHeight?: string;
  columns: HeadCell[];
  rows: Row[] | undefined;
  orderBy: string;
  uiType?: UiType;
};
