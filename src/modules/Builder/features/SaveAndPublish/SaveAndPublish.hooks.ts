import { useTranslation } from 'react-i18next';

import { useCheckIfNewApplet } from 'shared/hooks';
import { APPLET_PAGE_REGEXP_STRING, builderSessionStorage } from 'shared/utils';
import { applet, SingleApplet } from 'shared/state';
import { EnterAppletPasswordForm } from 'modules/Dashboard';

import { appletActivitiesMocked, appletActivityFlowsMocked, appletDataMocked } from './mock';
import { getAppletDataForApi } from './SaveAndPublish.utils';

export const getAppletInfoFromStorage = () => {
  const pathname = window.location.pathname;
  const match = pathname.match(APPLET_PAGE_REGEXP_STRING);
  if (!match) return {};

  return builderSessionStorage.getItem() ?? {};
};

export const useAppletData = () => {
  const isNewApplet = useCheckIfNewApplet();
  const { result: appletData } = applet.useAppletData() ?? {};
  const {
    i18n: { language },
  } = useTranslation('app');

  return (appletPassword?: EnterAppletPasswordForm['appletPassword']): SingleApplet => {
    const appletInfo = getAppletInfoFromStorage();
    const appletInfoForApi = getAppletDataForApi(appletInfo);

    if (isNewApplet) {
      return {
        ...appletDataMocked,
        ...appletInfoForApi,
        password: appletPassword,
        description: {
          [language]: appletInfo.description,
        },
        about: {
          [language]: appletInfo.about,
        },
        themeId: null, // TODO: create real themeId
        // eslint-disable-next-line
        // @ts-ignore
        activities: appletActivitiesMocked, // TODO: add real activities
        // eslint-disable-next-line
        // @ts-ignore
        activityFlows: appletActivityFlowsMocked, // TODO: add real activityFlows
      };
    }

    const appletDataForApi = getAppletDataForApi(appletData!);

    return {
      ...appletDataForApi,
      ...appletInfoForApi,
      password: appletPassword,
      description: {
        ...appletDataForApi.description,
        [language]: appletInfo?.description ?? appletDataForApi.description[language],
      },
      about: {
        ...appletDataForApi.about,
        [language]: appletInfo?.about ?? appletDataForApi.about[language],
      },
      themeId: null, // TODO: create real themeId
      // eslint-disable-next-line
      // @ts-ignore
      activities: appletActivitiesMocked, // TODO: api has error details: items-missed; order-permitted, description has wrong type
      // eslint-disable-next-line
      // @ts-ignore
      activityFlows: appletActivityFlowsMocked, // TODO: api has error details: items-missed; activitiesIds/order-permitted
    };
  };
};

export const useCheckIfHasAtLeastOneActivity = () => {
  const getAppletData = useAppletData();

  return () => {
    const body = getAppletData();

    return Boolean(body.activities?.length);
  };
};

export const useCheckIfHasAtLeastOneItem = () => {
  const getAppletData = useAppletData();

  return () => {
    const body = getAppletData();

    return (body.activities ?? []).every((activity) => Boolean(activity.items?.length));
  };
};
