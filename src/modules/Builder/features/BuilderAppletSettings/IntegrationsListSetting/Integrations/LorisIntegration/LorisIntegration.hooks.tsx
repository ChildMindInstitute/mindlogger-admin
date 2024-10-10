import { useEffect, useMemo, useState } from 'react';

import { applet } from 'shared/state/Applet';
import { authApiClient } from 'shared/api/apiConfig';
import { useAppDispatch } from 'redux/store';
import { IntegrationTypes } from 'shared/consts';

export const fetchLorisProjects = async (hostname: string, username: string, password: string) => {
  const endpoint = `/integrations/loris/projects?hostname=${hostname}&username=${username}&password=${password}`;
  const res = await authApiClient.get(endpoint);

  if (res.status !== 200) {
    throw new Error('Failed to fetch projects');
  }

  return res.data.projects;
};

export const saveLorisProject = async (
  appletId: string,
  hostname: string,
  username: string,
  password: string,
  project: string,
) => {
  const endpoint = `/integrations`;
  const payload = {
    appletId,
    integrationType: 'LORIS',
    configuration: {
      hostname,
      username,
      password,
      project,
    },
  };

  const res = await authApiClient.post(endpoint, payload);

  if (res.status !== 201 && res.status !== 200) {
    throw new Error('Failed to save project');
  }

  return res.data;
};

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

export const useFetchLorisIntegrationStatus = (appletId: string | undefined): boolean => {
  const [isIntegrated, setIsIntegrated] = useState(false);

  const { result: appletData } = applet.useAppletData() ?? {};
  const { updateAppletData } = applet.actions;

  const dispatch = useAppDispatch();

  useEffect(() => {
    const fetchLorisIntegrationStatus = async () => {
      if (!appletId) return;

      try {
        const endpoint = `/integrations?integration_type=LORIS&applet_id=${appletId}`;
        const res = await authApiClient.get(endpoint);
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
          setIsIntegrated(true);
          dispatch(updateAppletData(appletUpdatedData));
        }
      } catch (error) {
        console.error('Failed to fetch LORIS integration status:', error);
        setIsIntegrated(false);

        const appletUpdatedDataWithoutIntegration = {
          ...appletData,
          integrations: appletData?.integrations?.filter(
            (i) => i.integrationType !== IntegrationTypes.Loris,
          ),
        };
        dispatch(updateAppletData(appletUpdatedDataWithoutIntegration));
      }
    };
    fetchLorisIntegrationStatus();
  }, [appletId]);

  return isIntegrated;
};
