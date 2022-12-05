import { RowContent } from 'components/Tables';

export const filterRows = (item: RowContent, searchValue: string) =>
  item?.value.toString().toLowerCase().includes(searchValue.toLowerCase());
