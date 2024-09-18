import { useCustomFormContext } from 'modules/Builder/hooks';
import { useCheckIfNewApplet } from 'shared/hooks';
import { AppletSettings } from 'shared/features/AppletSettings';
import { workspaces, applet } from 'redux/modules';

import { getSettings } from './BuilderAppletSettings.utils';

export const BuilderAppletSettings = () => {
  const isNewApplet = useCheckIfNewApplet();
  const { watch } = useCustomFormContext();

  const { result: appletData } = applet.useAppletData() ?? {};

  const isPublished = watch('isPublished');
  const workspaceRoles = workspaces.useRolesData();

  return (
    <>
      {(isNewApplet || appletData) && (
        <AppletSettings
          isBuilder
          data-testid="builder-applet-settings"
          settings={getSettings({
            isNewApplet,
            isPublished,
            roles: appletData?.id ? workspaceRoles?.data?.[appletData.id] : undefined,
            enableShareToLibrary: featureFlags.enableShareToLibrary,
            enableLorisIntegration,
            appletId: appletData?.id,
          })}
        />
      )}
    </>
  );
};
