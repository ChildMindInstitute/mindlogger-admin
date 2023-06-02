import { Folder } from 'api';
import { TFunction } from 'i18next';

export const generateNewFolderName = (folders: Folder[], t: TFunction) => {
  const newFolder = t('newFolder');
  const names = folders.filter(({ name }) => name);

  if (!names.length) {
    return newFolder;
  }

  const result: RegExpExecArray[] = [];

  names.forEach(({ name = '' }) => {
    const exist = new RegExp(/^New Folder\s\((\d+)\)$|^New Folder$/).exec(name);
    if (exist) {
      result.push(exist);
    }
  });

  if (!result.length) {
    return newFolder;
  }

  const [_, index = 0] = result.sort((a, b) => {
    if (a[0] > b[0]) {
      return -1;
    }
    if (a[0] < b[0]) {
      return 1;
    }

    return 0;
  })[0];

  return `${newFolder} (${+index + 1})`;
};
