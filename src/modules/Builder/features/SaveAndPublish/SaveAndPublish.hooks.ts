import { useTranslation } from 'react-i18next';

import { useCheckIfNewApplet } from 'shared/hooks';
import { APPLET_PAGE_REGEXP_STRING, builderSessionStorage } from 'shared/utils';
import { applet } from 'shared/state';

import {
  appletActivitiesMocked,
  appletActivityFlowsMocked,
  appletDataMocked,
  appletPasswordMocked,
} from './mock';

export const useAppletInfoFromStorage = () => builderSessionStorage.getItem() ?? {};

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

  return () => {
    const appletInfo = getAppletInfoFromStorage();

    if (isNewApplet) {
      return {
        ...appletDataMocked,
        ...appletInfo,
        description: {
          [language]: appletInfo.description,
        },
        about: {
          [language]: appletInfo.about,
        },
        themeId: null, // TODO: create real themeId
      };
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
      description: {
        ...appletDataForApi.description,
        [language]: appletInfo?.description ?? appletDataForApi.description[language],
      },
      about: {
        ...appletDataForApi.about,
        [language]: appletInfo?.about ?? appletDataForApi.about[language],
      },
      themeId: null, // TODO: create real themeId
      password: appletPasswordMocked, // TODO: add password flow
      activities: appletActivitiesMocked, // TODO: api has error details: items-missed; order-permitted, description has wrong type
      activityFlows: appletActivityFlowsMocked, // TODO: api has error details: items-missed; activitiesIds/order-permitted
    };
  };
};
