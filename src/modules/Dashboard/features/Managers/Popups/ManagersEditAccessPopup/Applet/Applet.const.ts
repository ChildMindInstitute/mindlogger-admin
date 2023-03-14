import { MenuItem } from 'shared/components/Menu/Menu.types';
import { Roles } from 'shared/consts';

export const getMenuItems = (addRole: (title: Roles) => void): MenuItem[] => {
  const action = (title?: string) => {
    title && addRole(title as Roles);
  };

  return [
    {
      title: Roles.Editor,
      action,
    },
    {
      title: Roles.Reviewer,
      action,
    },
    {
      title: Roles.Coordinator,
      action,
    },
    {
      title: Roles.Manager,
      action,
    },
  ];
};
