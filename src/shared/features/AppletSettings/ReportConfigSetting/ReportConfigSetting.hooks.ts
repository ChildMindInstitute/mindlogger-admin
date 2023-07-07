import { useParams } from 'react-router-dom';

import { LocalStorageKeys, storage } from 'shared/utils';

import { verifyReportServer, setPasswordReportServer } from './ReportConfigSetting.utils';
import { UseCheckReportServer } from './ReportConfigSetting.types';
import { OK_MESSAGE, SUCCESS_MESSAGE } from './ReportConfigSetting.const';

export const useCheckReportServer = ({ url, publicKey }: UseCheckReportServer) => {
  const { appletId = '', ownerId = '' } = useParams();

  const onVerify = async () => {
    const token = storage.getItem(LocalStorageKeys.AccessToken);

    try {
      const response = await verifyReportServer({ url, publicKey, token: `${token}` });
      const { message } = (await response.json()) ?? {};

      return message === OK_MESSAGE;
    } catch {
      return false;
    }
  };

  const onSetPassword = async (password: string) => {
    const token = storage.getItem(LocalStorageKeys.AccessToken);

    try {
      const response = await setPasswordReportServer({
        url,
        appletId,
        ownerId,
        token: `${token}`,
        password,
      });
      const { message } = (await response.json()) ?? {};

      return message === SUCCESS_MESSAGE;
    } catch {
      return false;
    }
  };

  return {
    onVerify,
    onSetPassword,
  };
};
