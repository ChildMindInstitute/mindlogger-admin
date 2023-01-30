export const formatDate = (date: Date) =>
  [date.getFullYear(), date.getMonth(), date.getDate()].join('-');
export const onlyMonthDate = (date: Date) => new Date(date.getFullYear(), date.getMonth());
