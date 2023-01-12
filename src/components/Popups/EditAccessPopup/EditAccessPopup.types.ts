import { User } from 'components/Tables/ManagersTable/ManagersTable.types';

export type EditAccessPopupProps = {
  onClose: () => void;
  editAccessPopupVisible: boolean;
  user: User;
};

export type Role = {
  label: string;
  icon: JSX.Element | undefined;
};

export type Applet = {
  id: string;
  title: string;
  img: string;
  roles: Role[];
};
