import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

import { Svg } from 'components/Svg';
import { auth, account, Breadcrumb } from 'redux/modules';
import { page } from 'resources';
import { getAppletData } from 'utils/getAppletData';

export const useBaseBreadcrumbs = () => {
  const { id } = useParams();
  const authData = auth.useData();
  const appletsFoldersData = account.useFoldersApplets();

  const [baseBreadcrumbs, setBaseBreadcrumbs] = useState<Breadcrumb[]>([]);

  useEffect(() => {
    let authCrumbs: Breadcrumb[] = [];
    let appletCrumbs: Breadcrumb[] = [];

    if (authData) {
      const { firstName, lastName } = authData.user;
      authCrumbs = [
        {
          icon: <Svg id="home" width="14" height="16" />,
          label: `${firstName}${lastName ? ` ${lastName}` : ''}'s Dashboard`,
          navPath: page.dashboard,
        },
      ];
    }
    if (id && appletsFoldersData) {
      const { name, image } = getAppletData(appletsFoldersData, id);
      appletCrumbs = [
        {
          icon: image || '',
          label: name || '',
          navPath: `/${id}`,
        },
      ];
    }

    setBaseBreadcrumbs([...authCrumbs, ...appletCrumbs]);
  }, [authData, appletsFoldersData, id]);

  return baseBreadcrumbs;
};
