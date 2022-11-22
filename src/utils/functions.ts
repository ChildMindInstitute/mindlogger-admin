import { RowContent } from 'components/Table';

export const filterRows = (item: RowContent, searchValue: string) =>
  item?.value.toString().toLowerCase().includes(searchValue.toLowerCase());
