import { useCheckIfNewApplet } from 'shared/hooks/useCheckIfNewApplet';
import { auth } from 'modules/Auth';
import { storage } from 'shared/utils';

const getKey = (ownerId: string, appletId: string) => `pwd/${ownerId}/${appletId}`;

export const useEncryptionCheckFromStorage = () => {
  const isNewApplet = useCheckIfNewApplet();
  const userData = auth.useData();
  const ownerId = String(userData?.user?.id) || '';

  const getEncryptionCheck = (appletId: string) => {
    if (isNewApplet || !appletId || !ownerId) return '';

    return storage.getItem(getKey(ownerId, appletId)) as string;
  };

  const setEncryptionCheck = (appletId: string, checked: boolean) => {
    if (!appletId || !ownerId) return;

    const key = getKey(ownerId, appletId);
    if (!checked) return storage.removeItem(key);

    storage.setItem(key, checked);
  };

  return {
    getEncryptionCheck,
    setEncryptionCheck,
  };
};
