import FileSaver from 'file-saver';
import { zipSync, strToU8 } from 'fflate';

import { ExportCsvData } from 'shared/types';

export const exportCsvZip = async (csvDataList: ExportCsvData[], reportName: string) => {
  if (!csvDataList.length) return;

  try {
    // Convert CSV strings to Uint8Array for fflate
    const zipData: Record<string, Uint8Array> = {};
    for (const csvData of csvDataList) {
      zipData[csvData.name] = strToU8(csvData.data);
    }

    // Use fflate's zipSync for fast, synchronous zip generation
    // level: 0 means no compression (STORE mode) for maximum speed
    const zipped = zipSync(zipData, { level: 0 });
    const blob = new Blob([new Uint8Array(zipped)], { type: 'application/zip' });

    FileSaver.saveAs(blob, reportName);
  } catch (err) {
    console.warn(err);
  }
};
