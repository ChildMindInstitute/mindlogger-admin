import JSZip from 'jszip';
import FileSaver from 'file-saver';

import { ExportCsvData } from 'shared/types';

export const exportLinesZip = async (csvDataList: ExportCsvData[], reportName: string) => {
  if (!csvDataList.length) return;

  try {
    const zip = new JSZip();

    for (const csvData of csvDataList) {
      zip.file(csvData.name, csvData.data);
    }

    const generatedZip = await zip.generateAsync({
      type: 'blob',
      compression: 'DEFLATE',
    });

    FileSaver.saveAs(generatedZip, reportName);
  } catch (err) {
    console.log(err);
  }
};
