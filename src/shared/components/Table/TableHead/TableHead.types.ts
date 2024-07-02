import { HeadCell, Order } from 'shared/types/table';

import { UiType } from '../Table.types';

export type TableHeadProps = {
  className?: string;
  tableHeader: JSX.Element | null;
  headCells: HeadCell[];
  onRequestSort: (event: React.MouseEvent<unknown>, property: string) => void;
  order: Order;
  orderBy?: string;
  uiType?: UiType;
  hasColFixedWidth?: boolean;
  tableHeadBg?: string;
};
