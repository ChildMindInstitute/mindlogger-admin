import { useCustomFormContext } from 'modules/Builder/hooks';
import { useCheckIfNewApplet } from 'shared/hooks';
import { AppletSettings } from 'shared/features/AppletSettings';
import { workspaces, applet } from 'redux/modules';
import { useFeatureFlags } from 'shared/hooks/useFeatureFlags';

import { getSettings } from './BuilderAppletSettings.utils';

export const BuilderAppletSettings = () => {
  const isNewApplet = useCheckIfNewApplet();
  const { watch } = useCustomFormContext();

  const isPublished = watch('isPublished');
  const workspaceRoles = workspaces.useRolesData();
  const { result: appletData } = applet.useAppletData() ?? {};
  const { featureFlags } = useFeatureFlags();

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
            enableLorisIntegration: featureFlags.enableLorisIntegration,
            appletId: appletData?.id,
          })}
        />
      )}
    </>
  );
};
