export const exportTemplate = async <T extends unknown[]>({
  data,
  fileName,
  isXlsx,
  defaultData,
}: {
  data: T;
  fileName: string;
  isXlsx?: boolean;
  defaultData?: string[] | null;
}) => {
  const { writeFile, utils } = await import('xlsx');
  const workSheet = defaultData ? utils.aoa_to_sheet([defaultData]) : utils.json_to_sheet(data);
  const workBook = utils.book_new();

  utils.book_append_sheet(workBook, workSheet, 'Sheet1');

  // Fix for Safari (Allow Multiple File Downloads).
  // https://stackoverflow.com/questions/61961488/allow-multiple-file-downloads-in-safari
  // One of the possible options to download multiple files is to add these files to the archive.
  return new Promise((resolve) => {
    writeFile(workBook, `${fileName}${isXlsx ? '.xlsx' : '.csv'}`);

    setTimeout(() => {
      resolve(true);
    });
  });
};

export const convertJsonToCsv = async (data: unknown[]) => {
  const { utils } = await import('xlsx');

  return utils.sheet_to_csv(utils.json_to_sheet(data));
};
