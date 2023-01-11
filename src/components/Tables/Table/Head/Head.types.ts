import { HeadCell, Order } from 'types/table';

export type HeadProps = {
  tableHeader: JSX.Element;
  headCells: HeadCell[];
  onRequestSort: (event: React.MouseEvent<unknown>, property: string) => void;
  order: Order;
  orderBy?: string;
  headBackground?: string;
  hidePagination?: boolean;
};
