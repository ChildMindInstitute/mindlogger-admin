import { Applet } from 'api';

export const getAppletData = (data: Applet[], id?: string) => {
  const currentApplet = data?.find((applet) => applet.id === id);

  return {
    name: currentApplet?.displayName,
    image: currentApplet?.image,
    encryption: currentApplet?.encryption,
  };
};
