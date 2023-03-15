import { Dispatch, SetStateAction } from 'react';

import { Applet, FolderApplet } from 'redux/modules';
import { HeadCell, Order } from 'shared/types/table';

import { OrderBy } from '../Applets.types';

export type TableProps = {
  columns: HeadCell[];
  rows: FolderApplet[] | Applet[] | null;
  order: Order;
  setOrder: Dispatch<SetStateAction<Order>>;
  orderBy: OrderBy;
  setOrderBy: Dispatch<SetStateAction<OrderBy>>;
  headerContent: JSX.Element;
  page: number;
  setPage: Dispatch<SetStateAction<number>>;
  count: number;
  emptyComponent?: JSX.Element | string;
};
