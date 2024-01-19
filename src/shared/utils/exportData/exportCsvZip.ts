import FileSaver from 'file-saver';

import { ExportCsvData } from 'shared/types';

export const exportCsvZip = async (csvDataList: ExportCsvData[], reportName: string) => {
  if (!csvDataList.length) return;

  try {
    const JSZip = await import('jszip');
    const zip = new JSZip.default();

    for (const csvData of csvDataList) {
      zip.file(csvData.name, csvData.data);
    }

    const generatedZip = await zip.generateAsync({
      type: 'blob',
      compression: 'DEFLATE',
    });

    FileSaver.saveAs(generatedZip, reportName);
  } catch (err) {
    console.warn(err);
  }
};
