import { useTranslation } from 'react-i18next';

import { AppletSettings } from 'shared/features/AppletSettings/AppletSettings';
import { workspaces, applet } from 'redux/modules';
import { EmptyState, Spinner } from 'shared/components';
import { isManagerOrOwner } from 'shared/utils';
import { Roles } from 'shared/consts';

import { getSettings } from './DashboardAppletSettings.utils';

export const DashboardAppletSettings = () => {
  const { t } = useTranslation('app');
  const { result: appletData } = applet.useAppletData() ?? {};
  const workspaceRoles = workspaces.useRolesData();
  const appletRoles = appletData?.id ? workspaceRoles?.data?.[appletData.id] : undefined;

  if (!isManagerOrOwner(appletRoles?.[0]) && !appletRoles?.includes(Roles.Editor))
    return <EmptyState width="25rem">{t('noPermissions')}</EmptyState>;

  return appletData ? (
    <AppletSettings
      settings={getSettings({
        isPublished: appletData?.isPublished,
        roles: appletRoles,
      })}
      data-testid="dashboard-applet-settings"
    />
  ) : (
    <Spinner />
  );
};
