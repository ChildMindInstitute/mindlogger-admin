import { Applet, Role } from '../EditAccessPopup.types';

export type AppletProps = {
  index: number;
  title: string;
  img: string;
  roles: Role[];
  applets: Applet[];
  setApplets: (applets: Applet[]) => void;
};
