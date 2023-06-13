import { applet } from 'shared/state';

export const useIsServerConfigured = () => {
  const { result: appletData } = applet.useAppletData() ?? {};

  return Boolean(appletData?.reportServerIp && appletData?.reportPublicKey);
};
