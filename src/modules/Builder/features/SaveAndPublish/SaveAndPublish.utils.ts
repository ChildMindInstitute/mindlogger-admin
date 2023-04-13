import { storage } from 'shared/utils';
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

const getPasswordKey = (ownerId: string, appletId: string) => `pwd/${ownerId}/${appletId}`;

export const usePasswordFromStorage = () => {
  const isNewApplet = useCheckIfNewApplet();
  const userData = auth.useData();
  const ownerId = String(userData?.user?.id) || '';
  const { result: appletData } = applet.useAppletData() ?? {};

  const getPassword = () => {
    if (isNewApplet) return '';
    const appletId = appletData?.id ?? '';

    return storage.getItem(getPasswordKey(ownerId, appletId)) as string;
  };

  const setPassword = (appletId: string, password: string) => {
    storage.setItem(getPasswordKey(ownerId, appletId), password);
  };

  return {
    getPassword,
    setPassword,
  };
};
