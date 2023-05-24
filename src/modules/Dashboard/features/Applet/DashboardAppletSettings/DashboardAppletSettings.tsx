import { applet } from 'redux/modules';
import { AppletSettings } from 'shared/features/AppletSettings';
import { workspaces } from 'redux/modules';
import { Spinner } from 'shared/components';

import { getSettings } from './DashboardAppletSettings.utils';

export const DashboardAppletSettings = () => {
  const { result: appletData } = applet.useAppletData() ?? {};
  const priorityRoleData = workspaces.usePriorityRoleData();

  return appletData ? (
    <AppletSettings
      settings={getSettings({
        isPublished: appletData?.isPublished,
        role: priorityRoleData?.data,
      })}
    />
  ) : (
    <Spinner />
  );
};
