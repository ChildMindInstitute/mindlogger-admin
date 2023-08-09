import { generatePath, useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import { useBreadcrumbs } from 'shared/hooks';
import { page } from 'resources';
import { NavigationMenu } from 'shared/components';
import { NavigationItem } from 'shared/components/NavigationMenu/NavigationMenu.types';

import { AppletSettingsProps } from './AppletSettings.types';

export const AppletSettings = ({ settings, isBuilder = false }: AppletSettingsProps) => {
  const { t } = useTranslation('app');
  const { appletId } = useParams();
  const navigate = useNavigate();
  const BUILDER_SETTINGS = generatePath(page.builderAppletSettings, {
    appletId,
  });
  const DASHBOARD_SETTINGS = generatePath(page.appletSettings, {
    appletId,
  });

  useBreadcrumbs([
    {
      icon: 'settings',
      label: t('appletSettings'),
    },
  ]);

  const handleSettingClick = (setting: NavigationItem) => {
    navigateTo(setting.param);
  };

  const navigateTo = (param = '') => {
    if (!isBuilder) {
      return navigate(param ? `${DASHBOARD_SETTINGS}/${param}` : DASHBOARD_SETTINGS);
    }
    navigate(param ? `${BUILDER_SETTINGS}/${param}` : BUILDER_SETTINGS);
  };

  return (
    <NavigationMenu
      items={settings}
      onClose={() => navigateTo()}
      onSetActiveItem={handleSettingClick}
    />
  );
};
