import { MenuItem } from 'components/Menu/Menu.types';
import { Roles } from 'consts';

export const getMenuItems = (addRole: (title: Roles) => void): MenuItem[] => {
  const action = (title?: string) => {
    title && addRole(title as Roles);
  };

  return [
    {
      title: Roles.editor,
      action,
    },
    {
      title: Roles.reviewer,
      action,
    },
    {
      title: Roles.coordinator,
      action,
    },
    {
      title: Roles.manager,
      action,
    },
  ];
};
