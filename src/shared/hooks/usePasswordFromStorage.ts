import { useCheckIfNewApplet } from 'shared/hooks/useCheckIfNewApplet';
import { auth } from 'modules/Auth';
import { storage } from 'shared/utils';

const getPasswordKey = (ownerId: string, appletId: string) => `pwd/${ownerId}/${appletId}`;

export const usePasswordFromStorage = () => {
  const isNewApplet = useCheckIfNewApplet();
  const userData = auth.useData();
  const ownerId = String(userData?.user?.id) || '';

  const getPassword = (appletId: string) => {
    if (isNewApplet || !appletId || !ownerId) return '';

    return storage.getItem(getPasswordKey(ownerId, appletId)) as string;
  };

  const setPassword = (appletId: string, password: string) => {
    if (!appletId || !ownerId) return;

    storage.setItem(getPasswordKey(ownerId, appletId), password);
  };

  return {
    getPassword,
    setPassword,
  };
};
