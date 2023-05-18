import { AppletSettings } from 'shared/features/AppletSettings';
import { workspaces } from 'redux/modules';

import { getSettings } from './DashboardAppletSettings.const';

export const DashboardAppletSettings = () => {
  const priorityRoleData = workspaces.usePriorityRoleData();

  return <AppletSettings settings={getSettings(priorityRoleData?.data)} />;
};
