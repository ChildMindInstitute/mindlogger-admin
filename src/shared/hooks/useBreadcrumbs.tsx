import { useState, useEffect } from 'react';
import { useLocation, useParams, generatePath } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import { auth, folders, Breadcrumb, breadcrumbs, User, applet } from 'redux/modules';
import { useAppDispatch } from 'redux/store';
import { page } from 'resources';
import { getAppletData } from 'shared/utils/getAppletData';
import { checkIfAppletActivityFlowUrlPassed, checkIfAppletUrlPassed } from 'shared/utils';
import { useCheckIfNewApplet } from 'shared/hooks/useCheckIfNewApplet';

export const useBreadcrumbs = (restCrumbs?: Breadcrumb[]) => {
  const { id, appletId, activityId, activityFlowId } = useParams();
  const { t } = useTranslation('app');
  const dispatch = useAppDispatch();
  const { pathname } = useLocation();
  const authData = auth.useData();
  const appletsFoldersData = folders.useFlattenFoldersApplets();
  const { firstName, lastName } = (authData?.user as User) || {};
  const { result: appletData } = applet.useAppletData() ?? {};
  const isNewApplet = useCheckIfNewApplet();
  const appletLabel = (isNewApplet ? t('newApplet') : appletData?.displayName) ?? '';

  const [crumbs, setCrumbs] = useState<Breadcrumb[]>([]);

  useEffect(() => {
    const newBreadcrumbs: Breadcrumb[] = [];
    const userName = `${firstName} ${lastName}`;

    if (firstName && pathname.includes(page.dashboard)) {
      newBreadcrumbs.push({
        icon: 'home',
        label: t('userDashboard', { userName }),
        navPath: page.dashboard,
      });
    }
    if (firstName && pathname.includes(page.builder)) {
      newBreadcrumbs.push({
        icon: 'builder',
        label: t('userBuilder', { userName }),
        navPath: page.builder,
      });
    }
    if (pathname.includes(page.library)) {
      newBreadcrumbs.push({
        icon: 'library',
        label: t('appletLibrary'),
        navPath: page.library,
      });
    }
    if (id && appletsFoldersData) {
      const { name, image } = getAppletData(appletsFoldersData, id);
      newBreadcrumbs.push({
        icon: image || '',
        label: name || '',
        disabledLink: true,
      });
    }
    if (checkIfAppletUrlPassed(pathname)) {
      newBreadcrumbs.push({
        icon: 'applet-outlined',
        label: appletLabel,
        disabledLink: true,
      });
    }

    if (activityId) {
      newBreadcrumbs.push(
        {
          icon: 'checklist-outlined',
          label: t('activities'),
          navPath: generatePath(page.builderAppletActivities, { appletId, activityId }),
        },
        {
          icon: '',
          label: t('newActivity'), // TODO add Activity Name on Edit
          disabledLink: true,
        },
      );
    }

    if (checkIfAppletActivityFlowUrlPassed(pathname)) {
      newBreadcrumbs.push(
        {
          icon: 'flow',
          label: t('activityFlow'),
          navPath: generatePath(page.builderAppletActivityFlow, {
            appletId,
            activityId,
            activityFlowId,
          }), // TODO add Applet Activity Flow Id on Edit
        },
        {
          icon: '',
          label: t('newActivityFlow'), // TODO add Activity Flow Name on Edit
          disabledLink: true,
        },
      );
    }

    setCrumbs([...newBreadcrumbs, ...(restCrumbs || [])]);
  }, [t, firstName, lastName, appletsFoldersData, id, appletId, activityId, appletLabel, pathname]);

  useEffect(() => {
    if (crumbs?.length) {
      dispatch(breadcrumbs.actions.setBreadcrumbs(crumbs));
    }
  }, [crumbs, dispatch]);
};
