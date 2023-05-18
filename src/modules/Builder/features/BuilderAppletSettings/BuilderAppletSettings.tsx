import { useCheckIfNewApplet } from 'shared/hooks';
import { AppletSettings } from 'shared/features/AppletSettings';
import { workspaces } from 'redux/modules';

import { getSettings } from './BuilderAppletSettings.const';

export const BuilderAppletSettings = () => {
  const isNewApplet = useCheckIfNewApplet();
  const priorityRoleData = workspaces.usePriorityRoleData();

  return <AppletSettings isBuilder settings={getSettings(isNewApplet, priorityRoleData?.data)} />;
};
