import { HeadCell, Order } from '../Table.types';

export type HeadProps = {
  tableHeader: JSX.Element;
  headCells: HeadCell[];
  onRequestSort: (event: React.MouseEvent<unknown>, property: string) => void;
  order: Order;
  orderBy?: string;
};
