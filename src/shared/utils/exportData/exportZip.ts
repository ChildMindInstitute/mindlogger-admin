import JSZip from 'jszip';
import FileSaver from 'file-saver';

export const BLOB_ZIP_OPTIONS: JSZip.JSZipGeneratorOptions<'blob'> = {
  type: 'blob',
  compression: 'DEFLATE',
  compressionOptions: { level: 3 },
};

export const exportZip = async (data: { fileName: string; file: Blob }[], fileName: string) => {
  const dataArray = Array.isArray(data) ? data : [data];

  const zip = new JSZip();
  dataArray.forEach((data) => {
    zip.file(data.fileName, data.file);
  });

  const content = await zip.generateAsync(BLOB_ZIP_OPTIONS);
  FileSaver.saveAs(content, fileName);
};
