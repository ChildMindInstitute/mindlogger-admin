import JSZip from 'jszip';
import FileSaver from 'file-saver';

export const exportZip = async (data: { fileName: string; file: Blob }[], fileName: string) => {
  const dataArray = Array.isArray(data) ? data : [data];

  const zip = new JSZip();
  dataArray.forEach((data) => {
    zip.file(data.fileName, data.file);
  });

  const content = await zip.generateAsync({
    type: 'blob',
    compression: 'DEFLATE',
    compressionOptions: { level: 3 },
  });
  FileSaver.saveAs(content, fileName);
};
