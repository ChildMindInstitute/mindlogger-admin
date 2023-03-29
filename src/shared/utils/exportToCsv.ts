import { utils, writeFile } from 'xlsx';

export const exportToCsv = <T extends unknown[]>(data: T, fileName: string) => {
  const workSheet = utils.json_to_sheet(data);
  const workBook = utils.book_new();

  utils.book_append_sheet(workBook, workSheet, 'Sheet1');

  writeFile(workBook, `${fileName}.csv`);
};
