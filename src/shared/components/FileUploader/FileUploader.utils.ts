import * as XLSX from 'xlsx';

export const importTable = async (file: File) => {
  const validFileTypes = ['.csv', '.xls', '.xlsx', '.ods'];
  const fileExtension = file.name.split('.').pop()?.toLowerCase();
  if (!validFileTypes.includes(`.${fileExtension}`)) {
    throw new Error();
  }

  const fileBuffer = await new Response(file).arrayBuffer();
  const workbook = XLSX.read(fileBuffer, {
    cellDates: true,
  });
  const worksheet = Object.values(workbook.Sheets)[0];
  const data = XLSX.utils.sheet_to_json(worksheet);

  if (!data.length) {
    throw new Error();
  }

  return data as Record<string, string | number>[];
};
