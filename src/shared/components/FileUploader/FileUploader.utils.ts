import * as XLSX from 'xlsx';

export const importTable = async (file: File) => {
  const fileBuffer = await new Response(file).arrayBuffer();
  const workbook = XLSX.read(fileBuffer, {
    cellDates: true,
  });
  const worksheet = Object.values(workbook.Sheets)[0];
  const data = XLSX.utils.sheet_to_json(worksheet);

  return data as Record<string, string | number>[];
};
