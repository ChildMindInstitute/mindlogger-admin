import { DataTableItem } from 'shared/components';

export type SubscaleHeaderContentProps = {
  onRemove: () => void;
  name: string;
  title: string;
  open: boolean;
  onUpdate: (lookupTableData?: DataTableItem[]) => void;
};
