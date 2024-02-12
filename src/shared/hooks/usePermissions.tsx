import { useEffect, useState } from 'react';

import { useTranslation } from 'react-i18next';

import { workspaces } from 'redux/modules';
import { EmptyState } from 'shared/components';
import { getErrorMessage } from 'shared/utils';
import { ApiResponseCodes } from 'shared/api';

export const usePermissions = (asyncFunc: () => Promise<any> | undefined) => {
  const { t } = useTranslation('app');
  const [isForbidden, setIsForbidden] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { ownerId } = workspaces.useData() || {};

  useEffect(() => {
    if (!ownerId || !asyncFunc) return;

    (async () => {
      try {
        setIsLoading(true);
        const { payload } = await asyncFunc();

        if (
          payload?.response?.status === ApiResponseCodes.Forbidden ||
          payload?.status === ApiResponseCodes.Forbidden
        ) {
          return setIsForbidden(true);
        }
        setIsForbidden(false);
      } catch (e) {
        getErrorMessage(e);
      } finally {
        setIsLoading(false);
      }
    })();
  }, [ownerId]);

  return {
    isForbidden,
    noPermissionsComponent: <EmptyState width="25rem">{t('noPermissions')}</EmptyState>,
    isLoading,
  };
};
