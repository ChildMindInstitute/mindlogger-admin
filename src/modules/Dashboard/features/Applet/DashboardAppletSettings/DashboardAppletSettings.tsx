import { useTranslation } from 'react-i18next';

import { AppletSettings } from 'shared/features/AppletSettings';
import { workspaces, applet } from 'redux/modules';
import { EmptyTable, Spinner } from 'shared/components';
import { Roles } from 'shared/consts';

import { getSettings } from './DashboardAppletSettings.utils';

export const DashboardAppletSettings = () => {
  const { t } = useTranslation('app');
  const { result: appletData } = applet.useAppletData() ?? {};
  const workspaceRoles = workspaces.useRolesData();
  const appletRoles = appletData?.id ? workspaceRoles?.data?.[appletData.id] : undefined;

  if (appletRoles?.[0] === Roles.Reviewer)
    return <EmptyTable width="25rem">{t('noPermissions')}</EmptyTable>;

  return appletData ? (
    <AppletSettings
      settings={getSettings({
        isPublished: appletData?.isPublished,
        roles: appletRoles,
      })}
    />
  ) : (
    <Spinner />
  );
};
