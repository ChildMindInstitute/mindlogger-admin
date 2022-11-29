import { FoldersApplets } from 'redux/modules';

export const getAppletName = (data: FoldersApplets[] | null, id?: string): string | undefined => {
  const appletsFoldersArr = data?.reduce((acc: FoldersApplets[], current: FoldersApplets) => {
    acc = current.items ? acc.concat(current.items) : acc.concat(current);

    return acc;
  }, []);

  return appletsFoldersArr?.find((applet) => applet.id === id)?.name;
};
