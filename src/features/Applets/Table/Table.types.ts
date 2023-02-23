import { Dispatch, SetStateAction } from 'react';

import { FolderApplet } from 'redux/modules';
import { HeadCell, Order } from 'types/table';

import { OrderBy } from '../Applets.types';

export type TableProps = {
  columns: HeadCell[];
  rows: FolderApplet[] | undefined;
  order: Order;
  setOrder: Dispatch<SetStateAction<Order>>;
  orderBy: OrderBy;
  setOrderBy: Dispatch<SetStateAction<OrderBy>>;
  headerContent: JSX.Element;
  page: number;
  setPage: Dispatch<SetStateAction<number>>;
  emptyComponent?: JSX.Element | string;
};
