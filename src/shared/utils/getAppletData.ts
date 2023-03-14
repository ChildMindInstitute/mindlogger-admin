import { FolderApplet } from 'redux/modules';

export const getAppletData = (data: FolderApplet[], id?: string) => {
  const currentApplet = data?.find((applet) => applet.id === id);

  return {
    name: currentApplet?.name,
    image: currentApplet?.image,
    encryption: currentApplet?.encryption,
  };
};
