import { useState, useEffect } from 'react';
import { useLocation, useParams } from 'react-router-dom';

import { Svg } from 'components';
import { auth, folders, Breadcrumb, breadcrumbs } from 'redux/modules';
import { useAppDispatch } from 'redux/store';
import { page } from 'resources';
import { getAppletData } from 'utils/getAppletData';
import { useTranslation } from 'react-i18next';

export const useBreadcrumbs = (restCrumbs?: Breadcrumb[]) => {
  const { id } = useParams();
  const { t } = useTranslation('app');
  const dispatch = useAppDispatch();
  const location = useLocation();
  const authData = auth.useData();
  const appletsFoldersData = folders.useFlattenFoldersApplets();

  const [crumbs, setCrumbs] = useState<Breadcrumb[]>([]);

  useEffect(() => {
    const newBreadcrumbs: Breadcrumb[] = [];

    if (authData?.user?.fullName && location.pathname.includes(page.dashboard)) {
      const { fullName } = authData.user;
      newBreadcrumbs.push({
        icon: <Svg id="home" width="14" height="16" />,
        label: t('userDashboard', { userName: fullName }),
        navPath: page.dashboard,
      });
    }
    if (authData?.user?.fullName && location.pathname.includes(page.builder)) {
      const { fullName } = authData.user;
      newBreadcrumbs.push({
        icon: <Svg id="builder" width="18" height="18" />,
        label: t('userBuilder', { userName: fullName }),
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
    if (location.pathname.includes(page.newApplet)) {
      newBreadcrumbs.push({
        icon: <Svg id="applet-outlined" width="18" height="18" />,
        label: t('newApplet'),
        disabledLink: true,
      });
    }

    setCrumbs([...newBreadcrumbs, ...(restCrumbs || [])]);
  }, [t, authData, appletsFoldersData, id]);

  useEffect(() => {
    if (crumbs?.length) {
      dispatch(breadcrumbs.actions.setBreadcrumbs(crumbs));
    }
  }, [crumbs, dispatch, location]);
};
