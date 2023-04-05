import { Order } from 'shared/types';

export const getTableCell = <T>(data: T): { content: () => T; value: T } => ({
  content: () => data,
  value: data,
});

export const formattedOrder = (orderBy: string, order: Order) =>
  orderBy ? `${order === 'asc' ? '+' : '-'}${orderBy}` : '';
