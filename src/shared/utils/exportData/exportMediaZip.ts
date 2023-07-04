import { exportZip } from '../exportZip';

const getProcessedFileName = (url: string) => {
  let fileName = url.split('/').pop() || '';
  if (fileName.includes('.quicktime')) {
    fileName = fileName.replace('.quicktime', '.MOV');
  }

  return fileName;
};

export const exportMediaZip = async (mediaUrls: string[], reportName: string) => {
  if (!mediaUrls.length) return;

  try {
    const settledFetchDataList = await Promise.allSettled(
      mediaUrls.map((mediaUrl) => fetch(mediaUrl)),
    );
    const settledBlobDataList = await Promise.allSettled(
      settledFetchDataList.map((settledFetchData) => {
        if (settledFetchData.status === 'rejected') return Promise.reject(null);

        return settledFetchData.value.blob();
      }),
    );
    const mediaFiles = settledBlobDataList
      .map((settledBlobData, index) => {
        const fileName = getProcessedFileName(mediaUrls[index]);
        if (settledBlobData.status === 'rejected') return null;

        return {
          fileName,
          file: settledBlobData.value,
        };
      })
      .filter(Boolean);

    exportZip(mediaFiles as NonNullable<Parameters<typeof exportZip>[0]>, reportName);
  } catch (error) {
    console.warn(error);
  }
};
