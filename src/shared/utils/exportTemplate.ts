import { utils, writeFile } from 'xlsx';

export const exportTemplate = <T extends unknown[]>(data: T, fileName: string, isXlsx = false) => {
  const workSheet = utils.json_to_sheet(data);
  const workBook = utils.book_new();

  utils.book_append_sheet(workBook, workSheet, 'Sheet1');

  writeFile(workBook, `${fileName}${isXlsx ? '.xlsx' : '.csv'}`);
};

export const convertJsonToCsv = (data: unknown[]) => utils.sheet_to_csv(utils.json_to_sheet(data));
