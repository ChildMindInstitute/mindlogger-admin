import { Roles } from 'shared/consts';
import { Manager, ManagerApplet } from 'modules/Dashboard/types';

export type EditAccessPopupProps = {
  onClose: (shouldRefetch?: boolean) => void;
  popupVisible: boolean;
  user: Manager;
};

export type Role = {
  role: Roles;
  accessId?: string;
  icon?: JSX.Element;
  reviewerSubjects?: string[];
};

export type Applet = Omit<ManagerApplet, 'roles'> & {
  roles: Role[];
};
