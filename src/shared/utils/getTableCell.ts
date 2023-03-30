export const getTableCell = <T>(data: T): { content: () => T; value: T } => ({
  content: () => data,
  value: data,
});
