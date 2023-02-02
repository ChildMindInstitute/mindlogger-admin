import { Roles } from 'consts';
import { User } from 'features/Managers';
import { Applet } from '../EditAccessPopup.types';

export type AppletProps = {
  applet: Applet;
  addRole: (id: string, role: Roles) => void;
  removeRole: (id: string, role: Roles) => void;
  user: User;
  handleAddSelectedRespondents: (id: string, respondents: string[]) => void;
  appletsWithoutRespondents: string[];
};
