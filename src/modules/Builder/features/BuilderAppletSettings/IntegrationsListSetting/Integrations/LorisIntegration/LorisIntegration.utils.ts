import { IntegrationTypes } from 'shared/consts';
import { fetchLorisProjectsFromApi, saveIntegrationToApi } from 'modules/Builder/api';
import { Integration } from 'shared/state/Applet/Applet.schema';
import i18n from 'i18n';

export const fetchLorisProjects = async (hostname: string, username: string, password: string) => {
  const { t } = i18n;

  const res = await fetchLorisProjectsFromApi({
    hostname,
    username,
    password,
    integrationType: IntegrationTypes.Loris,
  });

  if (res.status !== 200) {
    throw new Error(t('loris.errors.fetchProjectsFailed'));
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
  const { t } = i18n;

  try {
    const res = await saveIntegrationToApi({
      appletId,
      integrationType: IntegrationTypes.Loris,
      configuration: {
        hostname,
        username,
        password,
        project,
      },
    });

    if (res.status !== 201 && res.status !== 200) {
      throw new Error(t('loris.errors.savingConnectionFailed'));
    }

    return res.data;
  } catch (error) {
    console.error(t('loris.errors.savingConnectionFailed'), error);
    throw new Error(t('loris.errors.savingConnectionFailed'));
  }
};

export const hasLorisIntegrationOnState = (integrations?: Integration[]): boolean =>
  Boolean(integrations?.some((i) => i.integrationType === IntegrationTypes.Loris));
