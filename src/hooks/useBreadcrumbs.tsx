import { useState, useEffect } from 'react';
import { useLocation, useParams } from 'react-router-dom';

import { Svg } from 'components/Svg';
import { auth, folders, Breadcrumb, breadcrumbs } from 'redux/modules';
import { useAppDispatch } from 'redux/store';
import { page } from 'resources';
import { getAppletData } from 'utils/getAppletData';

export const useBreadcrumbs = (restCrumbs?: Breadcrumb[]) => {
  const { id } = useParams();
  const dispatch = useAppDispatch();
  const location = useLocation();
  const authData = auth.useData();
  const appletsFoldersData = folders.useFlattenFoldersApplets();

  const [crumbs, setCrumbs] = useState<Breadcrumb[]>([]);

  useEffect(() => {
    const newBreadcrumbs: Breadcrumb[] = [];

    if (authData) {
      const { firstName, lastName } = authData.user;
      newBreadcrumbs.push({
        icon: <Svg id="home" width="14" height="16" />,
        label: `${firstName}${lastName ? ` ${lastName}` : ''}'s Dashboard`,
        navPath: page.dashboard,
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

    setCrumbs([...newBreadcrumbs, ...(id && restCrumbs ? restCrumbs : [])]);
  }, [authData, appletsFoldersData, id]);

  useEffect(() => {
    if (crumbs?.length) {
      dispatch(breadcrumbs.actions.setBreadcrumbs(crumbs));
    }
  }, [crumbs, dispatch, location]);
};
