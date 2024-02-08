import { useEffect } from 'react';

import get from 'lodash.get';

import { useEncryptionStorage } from 'shared/hooks';

import { useCheckIfHasEncryptionProps } from './Popups.types';

export const useCheckIfHasEncryption = ({ isAppletSetting, appletData, callback }: useCheckIfHasEncryptionProps) => {
  const { getAppletPrivateKey } = useEncryptionStorage();
  const appletId = get(appletData, isAppletSetting ? 'id' : 'appletId');
  const hasEncryptionCheck = !!getAppletPrivateKey(appletId ?? '');

  useEffect(() => {
    const shouldSkipPassword = !!appletData && hasEncryptionCheck;
    shouldSkipPassword && callback();
  }, [appletData, hasEncryptionCheck]);

  return hasEncryptionCheck;
};
