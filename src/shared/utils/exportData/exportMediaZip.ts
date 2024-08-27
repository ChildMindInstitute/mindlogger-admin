import { ExportMediaData } from 'shared/types';

import { exportZip } from './exportZip';

const chunkArray = <T>(array: T[], size: number): T[][] => {
  const result: T[][] = [];
  let index = 0;
  while (index < array.length) {
    result.push(array.slice(index, index + size));
    index += size;
  }

  return result;
};

export const exportMediaZip = async (mediaData: ExportMediaData[], reportName: string) => {
  const mediaDataLength = mediaData.length;
  if (!mediaDataLength) return;

  const CHUNK_SIZE = 5;
  const mediaChunks = chunkArray(mediaData, CHUNK_SIZE);

  try {
    for (let index = 0; index < mediaChunks.length; index++) {
      const chunk = mediaChunks[index];
      const settledFetchDataList = await Promise.allSettled(chunk.map(({ url }) => fetch(url)));

      const settledBlobDataList = await Promise.allSettled(
        settledFetchDataList.map((settledFetchData) => {
          if (settledFetchData.status === 'rejected') return Promise.reject(null);

          return settledFetchData.value.blob();
        }),
      );

      const mediaFiles = settledBlobDataList
        .map((settledBlobData, index) => {
          const { fileName } = chunk[index];
          if (settledBlobData.status === 'rejected') return null;

          return {
            fileName,
            file: settledBlobData.value,
          };
        })
        .filter(Boolean);

      await exportZip(
        mediaFiles as NonNullable<Parameters<typeof exportZip>[0]>,
        `${reportName}-${mediaDataLength > CHUNK_SIZE ? index + 1 : ''}.zip`,
      );

      chunk.length = 0;
    }
  } catch (error) {
    console.warn(error);
  }
};
