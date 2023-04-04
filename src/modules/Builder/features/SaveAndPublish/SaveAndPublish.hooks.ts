import { useTranslation } from 'react-i18next';

import { useCheckIfNewApplet } from 'shared/hooks';
import { APPLET_PAGE_REGEXP_STRING, builderSessionStorage } from 'shared/utils';
import { applet, SingleApplet } from 'shared/state';
import { EnterAppletPasswordForm } from 'modules/Dashboard';

import { appletActivitiesMocked, appletActivityFlowsMocked, appletDataMocked } from './mock';

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

  return (appletPassword?: EnterAppletPasswordForm['appletPassword']) => {
    const appletInfo = getAppletInfoFromStorage();

    if (isNewApplet) {
      return {
        ...appletDataMocked,
        ...appletInfo,
        password: appletPassword,
        description: {
          [language]: appletInfo.description,
        },
        about: {
          [language]: appletInfo.about,
        },
        themeId: null, // TODO: create real themeId
        activities: appletActivitiesMocked, // TODO: add real activities
      } as SingleApplet;
    }

    const {
      createdAt,
      updatedAt,
      id,
      retentionPeriod,
      retentionType,
      theme,
      version,
      ...appletDataForApi
    } = appletData!;

    return {
      ...appletDataForApi,
      ...appletInfo,
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
      activities: appletActivitiesMocked, // TODO: api has error details: items-missed; order-permitted, description has wrong type
      activityFlows: appletActivityFlowsMocked, // TODO: api has error details: items-missed; activitiesIds/order-permitted
    } as SingleApplet;
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
