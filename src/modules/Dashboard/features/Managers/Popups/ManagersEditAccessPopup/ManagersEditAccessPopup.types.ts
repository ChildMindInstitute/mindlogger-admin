import { Roles } from 'shared/consts';
import { Manager, ManagerApplet } from 'redux/modules';

export type EditAccessPopupProps = {
  onClose: () => void;
  editAccessPopupVisible: boolean;
  user: Manager;
  refetchManagers: () => void;
};

export type Role = {
  role: Roles;
  accessId?: string;
  icon?: JSX.Element;
};

export type Applet = Omit<ManagerApplet, 'roles'> & {
  selectedRespondents?: string[];
  roles: Role[];
};
