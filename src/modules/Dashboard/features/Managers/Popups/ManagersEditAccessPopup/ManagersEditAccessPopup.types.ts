import { Dispatch, SetStateAction } from 'react';

import { Roles } from 'shared/consts';
import { Manager, ManagerApplet } from 'redux/modules';

export type EditAccessPopupProps = {
  onClose: () => void;
  editAccessPopupVisible: boolean;
  setEditAccessSuccessPopupVisible: Dispatch<SetStateAction<boolean>>;
  user: Manager;
  reFetchManagers: () => void;
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
