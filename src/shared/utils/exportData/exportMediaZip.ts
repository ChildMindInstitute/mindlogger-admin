import { postFileDownloadApi } from 'api';

import { exportZip } from '../exportZip';

export const exportMediaZip = async (mediaData: string[], reportName: string) => {
  if (!mediaData.length) return;

  try {
    const mediaFiles = [];
    for (const key of mediaData) {
      const { data } = await postFileDownloadApi(key);
      const file = new Blob([data]);
      let fileName = key.split('/').pop() || '';
      if (fileName.includes('.quicktime')) {
        fileName = fileName.replace('.quicktime', '.MOV');
      }
      mediaFiles.push({ fileName, file });
    }
    exportZip(mediaFiles, reportName);
  } catch (error) {
    console.warn(error);
  }
};
