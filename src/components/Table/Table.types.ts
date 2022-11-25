export type Order = 'asc' | 'desc';

export type Cell = {
  align?: 'center' | 'inherit' | 'justify' | 'left' | 'right';
  width?: string;
};

export type HeadCell = Cell & {
  id: string;
  label: string;
  enableSort?: boolean;
};

export type RowContent = Cell & {
  content: () => React.ReactNode | string;
  value: string | number;
  onClick?: () => void;
};

export type Row = {
  [name: string]: RowContent;
};
export type TableProps = {
  tableHeight?: string;
  columns: HeadCell[];
  rows: Row[] | undefined;
  orderBy: string;
};
