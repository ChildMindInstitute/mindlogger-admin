import { SingleApplet } from 'shared/state';

export const getAppletDataForApi = (applet: SingleApplet) => {
  const {
    createdAt,
    updatedAt,
    id,
    retentionPeriod,
    retentionType,
    theme,
    version,
    ...appletDataForApi
  } = applet;

  return appletDataForApi;
};
