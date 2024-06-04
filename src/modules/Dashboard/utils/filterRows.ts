import { CellContent } from 'shared/components';

export const filterRows = (item: CellContent, searchValue: string) =>
  item?.value.toString().toLowerCase().includes(searchValue.toLowerCase());
