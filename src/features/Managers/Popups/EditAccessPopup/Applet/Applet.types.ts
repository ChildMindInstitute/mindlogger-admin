import { User } from 'features/Managers';
import { Applet } from '../EditAccessPopup.types';

export type AppletProps = {
  applet: Applet;
  addRole: (id: string, role: string) => void;
  removeRole: (id: string, role: string) => void;
  user: User;
};
