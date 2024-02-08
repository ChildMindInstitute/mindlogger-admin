import i18n from 'i18n';
import { Applet, Folder } from 'api';
import { groupBy } from 'shared/utils';

export const generateNewFolderName = (folders: Folder[]) => {
  const { t } = i18n;
  const newFolder = t('newFolder');
  const names = folders.filter(({ displayName }) => displayName);

  if (!names.length) {
    return newFolder;
  }

  const result: RegExpExecArray[] = [];

  names.forEach(({ displayName = '' }) => {
    const exist = new RegExp(/^New Folder\s\((\d+)\)$|^New Folder$/).exec(displayName);
    if (exist) {
      result.push(exist);
    }
  });

  if (!result.length) {
    return newFolder;
  }

  const [, index = 0] = result.sort((a, b) => {
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

export const getAppletsWithLocalFolders = (applets: Applet[], folders: Folder[], expandedFolders: string[]) => {
  const groupedApplets = groupBy(applets, 'folderId');

  return Object.keys(groupedApplets).reduce((result: (Folder | Applet)[], key: string) => {
    const applets = groupedApplets[key] ?? [];
    const folderRow = folders?.find(({ id }) => id === key);

    if (!folderRow) return [...result, ...applets];

    const folder = { ...folderRow, isFolder: true, foldersAppletCount: applets.length };

    if (expandedFolders.includes(folderRow.id))
      return [
        ...result,
        folder,
        ...applets.map(applet => ({
          ...applet,
          isFolder: false,
          parentId: folderRow.id,
        })),
      ];

    return [...result, folder];
  }, []);
};
