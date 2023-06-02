import { Dispatch, SetStateAction } from 'react';

import { Folder, Applet } from 'api';

export type AppletContextType = {
  rows: Array<Folder | Applet>;
  setRows: Dispatch<SetStateAction<(Folder | Applet)[]>>;
  expandedFolders: string[];
  fetchData: () => void;
  handleFolderClick: (folder: Folder) => void;
};
