import { useCustomFormContext } from 'modules/Builder/hooks';
import { useCheckIfNewApplet } from 'shared/hooks';
import { AppletSettings } from 'shared/features/AppletSettings';
import { workspaces, applet } from 'redux/modules';
import { useFeatureFlags } from 'shared/hooks/useFeatureFlags';

import { getSettings } from './BuilderAppletSettings.utils';

export const BuilderAppletSettings = () => {
  const isNewApplet = useCheckIfNewApplet();
  const { watch } = useCustomFormContext();

  const { result: appletData } = applet.useAppletData() ?? {};
  const { featureFlags } = useFeatureFlags();

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
            enableLorisIntegration: true, // featureFlags.enableLorisIntegration,
            enableProlificIntegration: true,
            appletId: appletData?.id,
          })}
        />
      )}
    </>
  );
};
