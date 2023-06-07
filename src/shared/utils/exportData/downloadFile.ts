import { writeFile, utils } from 'xlsx';

export const downloadFile = (data: unknown[], fileName?: string) => {
  const worksheet = utils.json_to_sheet(data);
  const workbook = utils.book_new();

  utils.book_append_sheet(workbook, worksheet, 'sheet');

  writeFile(workbook, fileName || 'report.csv');
};
