import { useState, useEffect } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import { Svg } from 'shared/components';
import { auth, folders, Breadcrumb, breadcrumbs, User, applet } from 'redux/modules';
import { useAppDispatch } from 'redux/store';
import { page } from 'resources';
import { getAppletData } from 'shared/utils/getAppletData';
import {
  checkIfAppletActivityFlowUrlPassed,
  checkIfAppletActivityUrlPassed,
  checkIfAppletUrlPassed,
} from 'shared/utils';
import { useCheckIfNewApplet } from 'shared/hooks/useCheckIfNewApplet';

export const useBreadcrumbs = (restCrumbs?: Breadcrumb[]) => {
  const { id } = useParams();
  const { t } = useTranslation('app');
  const dispatch = useAppDispatch();
  const location = useLocation();
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

    if (firstName && location.pathname.includes(page.dashboard)) {
      newBreadcrumbs.push({
        icon: <Svg id="home" width="14" height="16" />,
        label: t('userDashboard', { userName }),
        navPath: page.dashboard,
      });
    }
    if (firstName && location.pathname.includes(page.builder)) {
      newBreadcrumbs.push({
        icon: <Svg id="builder" width="18" height="18" />,
        label: t('userBuilder', { userName }),
        navPath: page.builder,
      });
    }
    if (location.pathname.includes(page.library)) {
      newBreadcrumbs.push({
        icon: <Svg id="library" width="18" height="18" />,
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
    if (checkIfAppletUrlPassed(location.pathname)) {
      newBreadcrumbs.push({
        icon: <Svg id="applet-outlined" width="18" height="18" />,
        label: appletLabel,
        disabledLink: true,
      });
    }

    if (checkIfAppletActivityUrlPassed(location.pathname)) {
      newBreadcrumbs.push(
        {
          icon: <Svg id="checklist-outlined" width="18" height="18" />,
          label: t('activities'),
          navPath: page.newAppletActivities, // TODO add Applet Activity Id on Edit
        },
        {
          icon: '',
          label: t('newActivity'), // TODO add Activity Name on Edit
          disabledLink: true,
        },
      );
    }

    if (checkIfAppletActivityFlowUrlPassed(location.pathname)) {
      newBreadcrumbs.push(
        {
          icon: <Svg id="flow" width="18" height="18" />,
          label: t('activityFlow'),
          navPath: page.newAppletActivityFlow, // TODO add Applet Activity Flow Id on Edit
        },
        {
          icon: '',
          label: t('newActivityFlow'), // TODO add Activity Flow Name on Edit
          disabledLink: true,
        },
      );
    }

    setCrumbs([...newBreadcrumbs, ...(restCrumbs || [])]);
  }, [t, firstName, lastName, appletsFoldersData, id]);

  useEffect(() => {
    if (crumbs?.length) {
      dispatch(breadcrumbs.actions.setBreadcrumbs(crumbs));
    }
  }, [crumbs, dispatch, location]);
};
