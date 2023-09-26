import { useCheckIfNewApplet } from 'shared/hooks/useCheckIfNewApplet';
import { auth } from 'modules/Auth/state';

const getKey = (ownerId: string, appletId: string) => `pwd/${ownerId}/${appletId}`;

export const useEncryptionStorage = () => {
  const isNewApplet = useCheckIfNewApplet();
  const userData = auth.useData();
  const ownerId = String(userData?.user?.id) || '';

  const getAppletPrivateKey = (appletId: string) => {
    if (isNewApplet || !appletId || !ownerId) return '';

    const key = getKey(ownerId, appletId);
    try {
      return JSON.parse(sessionStorage.getItem(key) as string);
    } catch {
      sessionStorage.removeItem(key);

      return '';
    }
  };

  const setAppletPrivateKey = (appletId: string, privateKey: number[]) => {
    if (!appletId || !ownerId) return;

    const key = getKey(ownerId, appletId);
    if (!privateKey) return sessionStorage.removeItem(key);

    sessionStorage.setItem(key, JSON.stringify(privateKey));
  };

  return {
    getAppletPrivateKey,
    setAppletPrivateKey,
  };
};
