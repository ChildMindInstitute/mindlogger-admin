export const filterRows = (item: string | undefined | null, searchValue: string) =>
  !!item?.toLowerCase().includes(searchValue.toLowerCase());
