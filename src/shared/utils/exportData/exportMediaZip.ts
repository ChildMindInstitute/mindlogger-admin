import { ExportMediaData } from 'shared/types';

import { exportZip } from './exportZip';

export const exportMediaZip = async (mediaData: ExportMediaData[], reportName: string) => {
  if (!mediaData.length) return;

  try {
    const settledFetchDataList = await Promise.allSettled(mediaData.map(({ url }) => fetch(url)));
    const settledBlobDataList = await Promise.allSettled(
      settledFetchDataList.map(settledFetchData => {
        if (settledFetchData.status === 'rejected') return Promise.reject(null);

        return settledFetchData.value.blob();
      }),
    );
    const mediaFiles = settledBlobDataList
      .map((settledBlobData, index) => {
        const { fileName } = mediaData[index];
        if (settledBlobData.status === 'rejected') return null;

        return {
          fileName,
          file: settledBlobData.value,
        };
      })
      .filter(Boolean);

    await exportZip(mediaFiles as NonNullable<Parameters<typeof exportZip>[0]>, reportName);
  } catch (error) {
    console.warn(error);
  }
};
