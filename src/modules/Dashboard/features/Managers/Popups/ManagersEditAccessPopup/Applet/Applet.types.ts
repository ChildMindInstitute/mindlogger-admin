import { Roles } from 'shared/consts';
import { Manager } from 'redux/modules';

import { Applet } from '../ManagersEditAccessPopup.types';

export type AppletProps = {
  applet: Applet;
  addRole: (id: string, role: Roles) => void;
  removeRole: (id: string, role: Roles) => void;
  user: Manager;
  handleAddSelectedRespondents: (id: string, respondents: string[]) => void;
  appletsWithoutRespondents: string[];
};
