import { MenuItem } from 'components/Menu/Menu.types';
import { Roles } from 'resources';

export const getMenuItems = (addRole: (title: string) => void): MenuItem[] => [
  {
    title: Roles.editor,
    action: (title?: string) => {
      title && addRole(title);
    },
  },
  {
    title: Roles.reviewer,
    action: (title?: string) => {
      title && addRole(title);
    },
  },
  {
    title: Roles.coordinator,
    action: (title?: string) => {
      title && addRole(title);
    },
  },
  {
    title: Roles.manager,
    action: (title?: string) => {
      title && addRole(title);
    },
  },
];
