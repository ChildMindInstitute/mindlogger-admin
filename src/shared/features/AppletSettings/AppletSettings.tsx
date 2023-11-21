import { generatePath, useNavigate, useParams } from 'react-router-dom';

import { page } from 'resources';
import { NavigationItem, NavigationMenu } from 'shared/components';

import { AppletSettingsProps } from './AppletSettings.types';

export const AppletSettings = ({
  settings,
  isBuilder = false,
  'data-testid': dataTestid,
}: AppletSettingsProps) => {
  const { appletId } = useParams();
  const navigate = useNavigate();
  const BUILDER_SETTINGS = generatePath(page.builderAppletSettings, {
    appletId,
  });
  const DASHBOARD_SETTINGS = generatePath(page.appletSettings, {
    appletId,
  });

  const handleSettingClick = (setting: NavigationItem) => {
    navigateTo(setting.param);

    setting.onClick?.();
  };

  const navigateTo = (param = '') => {
    if (!isBuilder) {
      return navigate(param ? `${DASHBOARD_SETTINGS}/${param}` : DASHBOARD_SETTINGS);
    }
    navigate(param ? `${BUILDER_SETTINGS}/${param}` : BUILDER_SETTINGS);
  };

  return (
    <NavigationMenu
      title="appletSettings"
      items={settings}
      onClose={() => navigateTo()}
      onSetActiveItem={handleSettingClick}
      data-testid={dataTestid}
    />
  );
};
