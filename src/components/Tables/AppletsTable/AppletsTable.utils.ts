import { TFunction } from 'i18next';
import { FolderApplet } from 'redux/modules';
import { Order } from 'types/table';

const descendingComparator = (a: FolderApplet, b: FolderApplet, orderBy: string) => {
  if (b.isNew || a.isNew) {
    return 0;
  }
  if (b[orderBy as keyof FolderApplet]! < a[orderBy as keyof FolderApplet]!) {
    return -1;
  }
  if (b[orderBy as keyof FolderApplet]! > a[orderBy as keyof FolderApplet]!) {
    return 1;
  }

  return 0;
};

const comparePinned = (a: FolderApplet, b: FolderApplet) => {
  if (a.pinOrder && b.pinOrder) {
    return 0;
  }
  if (a.pinOrder) {
    return -1;
  }
  if (b.pinOrder) {
    return 1;
  }
  return 0;
};

export const getComparator = (
  order: Order,
  orderBy: string,
): ((a: FolderApplet, b: FolderApplet) => number) =>
  order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);

const insert = <T>(index: number, array: T[], items: T[]) => array.splice(index, 0, ...items);

export const sortRows = (
  rows: FolderApplet[],
  compareFunction: (a: FolderApplet, b: FolderApplet) => number,
) => {
  const result = rows
    .filter(({ parentId, isFolder }) => !parentId || isFolder)
    .sort(compareFunction);
  const folders = rows.filter(({ isFolder }) => isFolder);
  folders.forEach((folder) => {
    const children = rows.filter(({ parentId }) => folder.id === parentId);
    const sortedChildren = children.sort(compareFunction).sort(comparePinned);
    const index = result.findIndex(({ id }) => id === folder.id);
    insert(index + 1, result, sortedChildren);
  });

  return result;
};

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
