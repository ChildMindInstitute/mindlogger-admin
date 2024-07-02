export type Order = 'asc' | 'desc';

export type Cell = {
  align?: 'center' | 'inherit' | 'justify' | 'left' | 'right';
  maxWidth?: string;
  width?: string;
};

export type HeadCell = Cell & {
  id: string;
  label: string | JSX.Element;
  enableSort?: boolean;
};
