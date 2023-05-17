import { applet } from 'redux/modules';
import { AppletSettings } from 'shared/features/AppletSettings';

import { getSettings } from './DashboardAppletSettings.utils';

export const DashboardAppletSettings = () => {
  const { result: appletData } = applet.useAppletData() ?? {};

  return <AppletSettings settings={getSettings({ isPublished: appletData?.isPublished })} />;
};
