import { useEffect } from 'react';

import { useEncryptionStorage } from 'shared/hooks';

import { useCheckIfHasEncryptionProps } from './Popups.types';

export const useCheckIfHasEncryption = ({ appletData, callback }: useCheckIfHasEncryptionProps) => {
  const { getAppletPrivateKey } = useEncryptionStorage();
  const hasEncryptionCheck = !!getAppletPrivateKey(appletData?.appletId ?? '');

  useEffect(() => {
    const shouldSkipPassword = !!appletData && hasEncryptionCheck;
    shouldSkipPassword && callback();
  }, [appletData, hasEncryptionCheck]);

  return hasEncryptionCheck;
};
