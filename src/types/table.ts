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
