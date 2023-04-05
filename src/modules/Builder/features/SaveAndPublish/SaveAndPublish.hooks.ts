import { useTranslation } from 'react-i18next';
import { v4 as uuidv4 } from 'uuid';

import { useCheckIfNewApplet } from 'shared/hooks';
import { APPLET_PAGE_REGEXP_STRING, builderSessionStorage } from 'shared/utils';
import { applet, Activity } from 'shared/state';
import { EnterAppletPasswordForm } from 'modules/Dashboard';

import { appletDataMocked, activityItemsMocked } from './mock';
import { removeAppletExtraFields, removeActivityExtraFields } from './SaveAndPublish.utils';

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

  return (appletPassword: EnterAppletPasswordForm['appletPassword']) => {
    const appletInfo = getAppletInfoFromStorage();

    if (isNewApplet) {
      return {
        ...appletDataMocked,
        ...appletInfo,
        activities: appletInfo?.activities.map((activity: Activity) => ({
          ...activity,
          key: uuidv4(),
          description: {
            [language]: activity.description,
          },
          items: activityItemsMocked,
          ...removeActivityExtraFields(),
        })),
        password: appletPassword,
        description: {
          [language]: appletInfo.description,
        },
        about: {
          [language]: appletInfo.about,
        },
        themeId: null, // TODO: create real themeId
        ...removeAppletExtraFields(),
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
      ...appletData,
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
      activities: appletInfo?.activities.map((activity: Activity) => ({
        ...activity,
        key: uuidv4(),
        description: {
          [language]: activity.description,
        },
        items: activityItemsMocked,
        ...removeActivityExtraFields(),
      })),
      // activityFlows: appletActivityFlowsMocked, // TODO: api has error details: items-missed; activitiesIds/order-permitted
      ...removeAppletExtraFields(),
    };
  };
};
