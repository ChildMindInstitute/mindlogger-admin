import { FolderApplet } from 'redux/modules';

export const getAppletName = (data: FolderApplet[] | null, id?: string): string | undefined => {
  const appletsFoldersArr = data?.reduce((acc: FolderApplet[], current: FolderApplet) => {
    acc = current.items ? acc.concat(current.items) : acc.concat(current);

    return acc;
  }, []);

  return appletsFoldersArr?.find((applet) => applet.id === id)?.name;
};
