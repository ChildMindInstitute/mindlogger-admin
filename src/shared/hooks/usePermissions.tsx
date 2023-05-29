import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { workspaces } from 'redux/modules';
import { EmptyTable } from 'shared/components';
import { getErrorMessage } from 'shared/utils';

export const usePermissions = (asyncFunc: () => Promise<any> | undefined) => {
  const { t } = useTranslation('app');
  const [isForbidden, setIsForbidden] = useState(false);
  const { ownerId } = workspaces.useData() || {};

  useEffect(() => {
    if (!ownerId || !asyncFunc) return;

    (async () => {
      try {
        const { payload } = await asyncFunc();

        if (payload?.response?.status === 403 || payload?.status === 403) {
          return setIsForbidden(true);
        }
        setIsForbidden(false);
      } catch (e) {
        getErrorMessage(e);
      }
    })();
  }, [ownerId]);

  return {
    isForbidden,
    noPermissionsComponent: <EmptyTable width="25rem">{t('noPermissions')}</EmptyTable>,
  };
};
