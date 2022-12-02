import { FolderApplet } from 'redux/modules';
import { Order } from 'types/table';

const descendingComparator = (a: FolderApplet, b: FolderApplet, orderBy: string) => {
  if (b[orderBy as keyof FolderApplet]! < a[orderBy as keyof FolderApplet]!) {
    return -1;
  }
  if (b[orderBy as keyof FolderApplet]! > a[orderBy as keyof FolderApplet]!) {
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
  const result = rows.filter((row) => !row.parentId).sort(compareFunction);
  const folders = rows.filter((row) => row.isFolder);
  folders.forEach((folder) => {
    const children = rows.filter((row) => folder.id === row.parentId).sort(compareFunction);
    const index = result.findIndex((row) => row.id === folder.id);
    insert(index + 1, result, children);
  });

  return result;
};
