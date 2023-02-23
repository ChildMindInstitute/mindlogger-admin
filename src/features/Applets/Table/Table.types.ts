import { FolderApplet } from 'redux/modules';
import { HeadCell, Order } from 'types/table';
import { Dispatch, SetStateAction } from 'react';

export type TableProps = {
  columns: HeadCell[];
  rows: FolderApplet[] | undefined;
  order: Order;
  setOrder: Dispatch<SetStateAction<Order>>;
  orderBy: string;
  setOrderBy: Dispatch<SetStateAction<string>>;
  headerContent: JSX.Element;
  page: number;
  setPage: Dispatch<SetStateAction<number>>;
  emptyComponent?: JSX.Element | string;
};
