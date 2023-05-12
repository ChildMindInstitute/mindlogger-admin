import { useCheckIfNewApplet } from 'shared/hooks/useCheckIfNewApplet';
import { auth } from 'modules/Auth';
import { storage } from 'shared/utils';

const getKey = (ownerId: string, appletId: string) => `pwd/${ownerId}/${appletId}`;

export const useEncryptionCheckFromStorage = () => {
  const isNewApplet = useCheckIfNewApplet();
  const userData = auth.useData();
  const ownerId = String(userData?.user?.id) || '';

  const getAppletPrivateKey = (appletId: string) => {
    if (isNewApplet || !appletId || !ownerId) return '';

    const key = getKey(ownerId, appletId);
    try {
      return JSON.parse(storage.getItem(key) as string);
    } catch {
      storage.removeItem(key);

      return '';
    }
  };

  const setAppletPrivateKey = (appletId: string, privateKey: number[]) => {
    if (!appletId || !ownerId) return;

    const key = getKey(ownerId, appletId);
    if (!privateKey) return storage.removeItem(key);

    storage.setItem(key, JSON.stringify(privateKey));
  };

  return {
    getAppletPrivateKey,
    setAppletPrivateKey,
  };
};
