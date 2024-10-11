import { useEffect, useMemo } from 'react';

import { applet } from 'shared/state/Applet';
import { useAppDispatch } from 'redux/store';
import { IntegrationTypes } from 'shared/consts';
import { getLorisIntegrationStatus } from 'modules/Builder/api';

export const useLorisConnectionInfo = () => {
  const { result: appletData } = applet.useAppletData() ?? {};
  const connectionInfo = useMemo(() => {
    const { hostname, project, username } =
      appletData?.integrations?.find((i) => i.integrationType === IntegrationTypes.Loris)
        ?.configuration || {};

    return { hostname, project, username };
  }, [appletData]);

  return connectionInfo;
};

export const useUpdateLorisIntegrationStatus = () => {
  const { result: appletData } = applet.useAppletData() ?? {};
  const { updateAppletData } = applet.actions;

  const dispatch = useAppDispatch();

  useEffect(() => {
    const fetchLorisIntegrationStatus = async () => {
      if (!appletData?.id) return;

      try {
        const res = await getLorisIntegrationStatus({
          applet_id: appletData.id,
          integration_type: IntegrationTypes.LorisUpperCase,
        });
        const { hostname, username, project } = res.data.configuration || {};

        if (res.status === 200 && hostname && username && project) {
          const appletUpdatedData = {
            ...appletData,
            integrations: [
              ...(appletData?.integrations || []),
              {
                integrationType: IntegrationTypes.Loris,
                configuration: {
                  hostname,
                  username,
                  project,
                },
              },
            ],
          };
          dispatch(updateAppletData(appletUpdatedData));
        }
      } catch (error) {
        // API is currently returning 404 when the integration is not found
        const appletUpdatedDataWithoutIntegration = {
          ...appletData,
          integrations: appletData?.integrations?.filter(
            (i) => i.integrationType !== IntegrationTypes.Loris,
          ),
        };
        // Updates the applet data state to remove the LORIS integration
        dispatch(updateAppletData(appletUpdatedDataWithoutIntegration));
      }
    };
    fetchLorisIntegrationStatus();
  }, [appletData?.id]);
};
