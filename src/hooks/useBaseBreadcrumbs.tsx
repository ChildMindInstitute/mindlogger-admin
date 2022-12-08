import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

import { Svg } from 'components/Svg';
import { auth, folders, Breadcrumb } from 'redux/modules';
import { page } from 'resources';
import { getAppletData } from 'utils/getAppletData';

export const useBaseBreadcrumbs = () => {
  const { id } = useParams();
  const authData = auth.useData();
  const appletsFoldersData = folders.useFoldersApplets();

  const [baseBreadcrumbs, setBaseBreadcrumbs] = useState<Breadcrumb[]>([]);

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

    setBaseBreadcrumbs(newBreadcrumbs);
  }, [authData, appletsFoldersData, id]);

  return baseBreadcrumbs;
};
