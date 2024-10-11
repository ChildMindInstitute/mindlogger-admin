import { IntegrationTypes } from 'shared/consts';
import { fetchLorisProjectsFromApi, saveIntegrationToApi } from 'modules/Builder/api';
import { Integration } from 'shared/state/Applet/Applet.schema';

export const fetchLorisProjects = async (hostname: string, username: string, password: string) => {
  const res = await fetchLorisProjectsFromApi({ hostname, username, password });

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
  try {
    const res = await saveIntegrationToApi({
      appletId,
      hostname,
      username,
      password,
      project,
      integrationType: IntegrationTypes.LorisUpperCase,
    });

    if (res.status !== 201 && res.status !== 200) {
      console.error('Failed to save project', res);
      throw new Error('Failed to save project'); // TODO CHECK IF THIS IS THE PATTERN IN THE APP 🧨
    }

    return res.data;
  } catch (error) {
    console.error('Error requesting to save project', error);
    throw new Error('Failed to save project');
  }
};

export const hasLorisIntegrationOnState = (integrations?: Integration[]): boolean =>
  Boolean(integrations?.some((i) => i.integrationType === IntegrationTypes.Loris));
