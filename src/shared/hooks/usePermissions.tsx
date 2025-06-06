import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { workspaces } from 'shared/state/Workspaces';
import { EmptyState } from 'shared/components/EmptyState';
import { ApiResponseCodes } from 'shared/api';
import { ErrorResponseType } from 'shared/types';

type FunctionResponse = {
  response?: { status?: ApiResponseCodes };
  status?: ApiResponseCodes;
};

export const usePermissions = (
  asyncFunc: () => Promise<any> | undefined,
  dependencies: unknown[] = [],
) => {
  const { t } = useTranslation('app');
  const [isForbidden, setIsForbidden] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { ownerId } = workspaces.useData() || {};

  const handlePermissionCheck = (response: FunctionResponse) => {
    if (
      ('status' in response && response.status === ApiResponseCodes.Forbidden) ||
      ('response' in response && response.response?.status === ApiResponseCodes.Forbidden) ||
      (Array.isArray(response) &&
        response.some((data) => data.type === ErrorResponseType.AccessDenied))
    ) {
      setIsForbidden(true);
    } else {
      setIsForbidden(false);
    }
  };

  useEffect(() => {
    if (!ownerId || !asyncFunc) return;

    (async () => {
      try {
        setIsLoading(true);
        const { payload, error } = await asyncFunc();

        handlePermissionCheck(error ?? payload);
      } catch (error) {
        handlePermissionCheck(error as FunctionResponse);
      } finally {
        setIsLoading(false);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ownerId, ...dependencies]);

  return {
    isForbidden,
    noPermissionsComponent: <EmptyState width="25rem">{t('noPermissions')}</EmptyState>,
    isLoading,
  };
};
