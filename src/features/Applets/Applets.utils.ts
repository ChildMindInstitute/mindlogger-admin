import { TFunction } from 'i18next';
import { FolderApplet } from 'redux/modules';

export const generateNewFolderName = (foldersApplets: FolderApplet[], t: TFunction) => {
  const newFolder = t('newFolder');
  const folders = foldersApplets.filter(({ isFolder, name }) => isFolder && name);

  if (!folders.length) {
    return newFolder;
  }

  const result: RegExpExecArray[] = [];

  folders.forEach(({ name = '' }) => {
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
