export const getSearchIncludes = (value: string, searchValue: string) =>
  value.toLowerCase().indexOf(searchValue.toLowerCase()) !== -1;
