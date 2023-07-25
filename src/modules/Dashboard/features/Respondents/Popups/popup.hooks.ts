import { useEffect } from 'react';

import { useEncryptionCheckFromStorage } from 'shared/hooks';

import { useCheckIfHasEncryptionProps } from './popups.types';

export const useCheckIfHasEncryption = ({ appletData, callback }: useCheckIfHasEncryptionProps) => {
  const { getAppletPrivateKey } = useEncryptionCheckFromStorage();
  const hasEncryptionCheck = !!getAppletPrivateKey(appletData?.appletId ?? '');

  useEffect(() => {
    const shouldSkipPassword = !!appletData && hasEncryptionCheck;
    shouldSkipPassword && callback();
  }, [appletData, hasEncryptionCheck]);

  return hasEncryptionCheck;
};
