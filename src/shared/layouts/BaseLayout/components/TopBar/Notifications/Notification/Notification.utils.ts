import { AlertMessageType } from 'shared/state/Alerts';
import { variables } from 'shared/styles';

export const getMessageColor = (isActive: boolean, type: AlertMessageType) => {
  if (type === 'integration') {
    return variables.palette.error;
  }

  return isActive ? variables.palette.on_secondary_container : variables.palette.on_surface;
};
