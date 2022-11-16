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
  content: () => React.ReactNode;
  value: string | number;
};

export type TableOptions = {
  labelRowsPerPage?: string;
  rowsPerPage?: number;
};

export type Row = {
  [name: string]: RowContent;
};

export type TableProps = {
  columns: HeadCell[];
  rows: Row[];
  options?: TableOptions;
  orderBy: string;
};
