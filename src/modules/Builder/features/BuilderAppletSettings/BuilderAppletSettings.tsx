import { useCustomFormContext } from 'modules/Builder/hooks';
import { useCheckIfNewApplet } from 'shared/hooks';
import { AppletSettings } from 'shared/features/AppletSettings';
import { workspaces, applet } from 'redux/modules';
import { useFeatureFlags } from 'shared/hooks/useFeatureFlags';
import { Integrations } from 'shared/consts';

import { getSettings } from './BuilderAppletSettings.utils';

export const BuilderAppletSettings = () => {
  const isNewApplet = useCheckIfNewApplet();
  const { watch, setValue } = useCustomFormContext();

  const { result: appletData } = applet.useAppletData() ?? {};
  const { featureFlags } = useFeatureFlags();

  const isPublished = watch('isPublished');
  const workspaceRoles = workspaces.useRolesData();
  const integrations = workspaces.useData()?.integrations;

  const publishedLorisIntegration = integrations?.some(
    (integration) =>
      integration?.integrationType?.toLowerCase() === Integrations.Loris.toLowerCase(),
  );
  const enableLorisIntegration = publishedLorisIntegration && featureFlags.enableLorisIntegration;

  const handleReportConfigSubmit = (values: Record<string, unknown>) => {
    const keys = [
      'reportRecipients',
      'reportIncludeUserId',
      'reportEmailBody',
      'reportServerIp',
      'reportPublicKey',
    ];

    keys.forEach((key) => setValue(key, values[key]));
  };

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
            onReportConfigSubmit: handleReportConfigSubmit,
            enableLorisIntegration,
            appletId: appletData?.id,
          })}
        />
      )}
    </>
  );
};
