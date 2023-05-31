import { FolderApplet } from 'redux/modules';
import { Roles } from 'shared/consts';

export type Actions = {
  actions: {
    removeFromFolder: () => void;
    viewUsers: () => void;
    viewCalendar: () => void;
    deleteAction: () => void;
    duplicateAction: () => void;
    transferOwnership: () => void;
    shareAppletAction: () => void;
    publishAppletAction: () => void;
    editAction: (item: FolderApplet) => void;
  };
  item: FolderApplet;
  roles?: Roles[];
};

export type AppletItemProps = { item: FolderApplet; onPublish: () => void };
