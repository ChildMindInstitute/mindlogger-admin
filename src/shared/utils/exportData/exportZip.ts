import FileSaver from 'file-saver';
import { zipSync } from 'fflate';

export const exportZip = async (data: { fileName: string; file: Blob }[], fileName: string) => {
  const dataArray = Array.isArray(data) ? data : [data];

  // Convert blobs to Uint8Array for fflate
  const zipData: Record<string, Uint8Array> = {};
  for (const item of dataArray) {
    const arrayBuffer = await item.file.arrayBuffer();
    zipData[item.fileName] = new Uint8Array(arrayBuffer);
  }

  // Use fflate's zipSync for fast, synchronous zip generation
  // level: 0 means no compression (STORE mode) for maximum speed
  const zipped = zipSync(zipData, { level: 0 });
  const content = new Blob([new Uint8Array(zipped)], { type: 'application/zip' });

  FileSaver.saveAs(content, fileName);
};
