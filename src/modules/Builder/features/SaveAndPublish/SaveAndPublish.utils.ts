import storage from 'shared/utils/storage';
import { auth } from 'modules/Auth';
import { applet } from 'shared/state';
import { useCheckIfNewApplet } from 'shared/hooks';

export const removeAppletExtraFields = () => ({
  createdAt: undefined,
  updatedAt: undefined,
  id: undefined,
  retentionPeriod: undefined,
  retentionType: undefined,
  theme: undefined,
  version: undefined,
});

export const removeActivityExtraFields = () => ({ order: undefined, id: undefined });

const getPasswordKey = (userId: string, appletId: string) => `pwd/${userId}/${appletId}`;

export const usePasswordFromStorage = () => {
  const isNewApplet = useCheckIfNewApplet();
  const userData = auth.useData();
  const userId = String(userData?.user?.id) || '';
  const { result: appletData } = applet.useAppletData() ?? {};

  const getPassword = () => {
    if (isNewApplet) return '';
    const appletId = appletData?.id ?? '';

    return storage.getItem(getPasswordKey(userId, appletId)) as string;
  };

  const setPassword = (appletId: string, password: string) => {
    storage.setItem(getPasswordKey(userId, appletId), password);
  };

  return {
    getPassword,
    setPassword,
  };
};
