import { Roles } from 'shared/consts';
import { User } from 'modules/Dashboard/features/Managers';
import { Applet } from '../ManagersEditAccessPopup.types';

export type AppletProps = {
  applet: Applet;
  addRole: (id: string, role: Roles) => void;
  removeRole: (id: string, role: Roles) => void;
  user: User;
  handleAddSelectedRespondents: (id: string, respondents: string[]) => void;
  appletsWithoutRespondents: string[];
};
