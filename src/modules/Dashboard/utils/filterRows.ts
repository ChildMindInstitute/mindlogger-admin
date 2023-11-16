import { RowContent } from 'shared/components';

export const filterRows = (item: RowContent, searchValue: string) =>
  item?.value.toString().toLowerCase().includes(searchValue.toLowerCase());
