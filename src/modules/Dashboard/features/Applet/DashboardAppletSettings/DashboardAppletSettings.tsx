import { applet } from 'redux/modules';
import { AppletSettings } from 'shared/features/AppletSettings';
import { workspaces } from 'redux/modules';

import { getSettings } from './DashboardAppletSettings.utils';

export const DashboardAppletSettings = () => {
  const { result: appletData } = applet.useAppletData() ?? {};

  // return <AppletSettings settings={getSettings({ isPublished: appletData?.isPublished })} />;
  // import { getSettings } from './DashboardAppletSettings.const';

  // export const DashboardAppletSettings = () => {
  const priorityRoleData = workspaces.usePriorityRoleData();

  return (
    <AppletSettings
      settings={getSettings({ isPublished: appletData?.isPublished, role: priorityRoleData?.data })}
    />
  );
};
