export const filterRows = (item: string | undefined, searchValue: string) =>
  item?.toLowerCase().includes(searchValue.toLowerCase());
