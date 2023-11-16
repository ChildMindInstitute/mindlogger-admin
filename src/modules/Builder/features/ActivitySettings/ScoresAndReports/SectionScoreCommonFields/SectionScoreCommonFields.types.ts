import { DataTableItem } from 'shared/components';

export type CommonFieldsProps = {
  name: string;
  sectionId?: string;
  tableHeadBackground?: string;
  'data-testid'?: string;
  items: DataTableItem[];
};
