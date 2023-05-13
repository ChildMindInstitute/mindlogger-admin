import { FolderApplet } from 'redux/modules';

export type Actions = {
  actions: {
    removeFromFolder: () => void;
    viewUsers: () => void;
    viewCalendar: () => void;
    deleteAction: () => void;
    duplicateAction: () => void;
    transferOwnership: () => void;
    shareAppletAction: () => void;
    editAction: (item: FolderApplet) => void;
  };
  item: FolderApplet;
};

export const enum Roles {
  User = 'user',
  Coordinator = 'coordinator',
  Editor = 'editor',
  Manager = 'manager',
  Reviewer = 'reviewer',
  Owner = 'owner',
}
