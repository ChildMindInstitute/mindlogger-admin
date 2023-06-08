import { Applet } from 'api';
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
    editAction: (item: Applet) => void;
  };
  item: Applet;
  roles?: Roles[];
};

export type AppletItemProps = { item: Applet; onPublish: () => void };
