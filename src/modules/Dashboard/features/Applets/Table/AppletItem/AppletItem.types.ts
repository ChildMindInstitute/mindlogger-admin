import { Applet } from 'api';

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
};

export type AppletItemProps = { item: Applet; onPublish: () => void };
