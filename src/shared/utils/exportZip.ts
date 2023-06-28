import JSZip from 'jszip';
import FileSaver from 'file-saver';

export const exportZip = async (data: { fileName: string; file: Blob }[], fileName: string) => {
  const dataArray = Array.isArray(data) ? data : [data];

  const zip = new JSZip();
  dataArray.forEach((data) => {
    zip.file(data.fileName, data.file, { base64: true });
  });

  zip.generateAsync({ type: 'blob' }).then((content) => {
    FileSaver.saveAs(content, fileName);
  });
};
