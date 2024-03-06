import { DataTableItem } from 'shared/components';

export type SectionContentProps = {
  name: string;
  title: string;
  sectionId?: string;
  'data-testid'?: string;
  items: DataTableItem[];
  index: number;
  isStaticActive: boolean;
};
