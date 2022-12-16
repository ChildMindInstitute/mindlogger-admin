import { FolderApplet } from 'redux/modules';

export const getAppletData = (data: FolderApplet[], id?: string) => {
  const appletsFoldersArr = data.reduce((acc: FolderApplet[], current: FolderApplet) => {
    acc = current.items ? acc.concat(current.items) : acc.concat(current);

    return acc;
  }, []);
  const currentApplet = appletsFoldersArr?.find((applet) => applet.id === id);

  return {
    name: currentApplet?.name,
    image: currentApplet?.image,
    encryption: currentApplet?.encryption,
  };
};
