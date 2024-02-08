import { Manager, ManagerApplet } from 'modules/Dashboard/types';
import { Roles } from 'shared/consts';

export type EditAccessPopupProps = {
  onClose: (shouldRefetch?: boolean) => void;
  popupVisible: boolean;
  user: Manager;
};

export type Role = {
  role: Roles;
  accessId?: string;
  icon?: JSX.Element;
  reviewerRespondents?: string[];
};

export type Applet = Omit<ManagerApplet, 'roles'> & {
  roles: Role[];
};
