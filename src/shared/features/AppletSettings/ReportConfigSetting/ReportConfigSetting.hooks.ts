import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import { authStorage } from 'shared/utils';
import { SingleApplet } from 'shared/state';

import { verifyReportServer, setPasswordReportServer } from './ReportConfigSetting.utils';
import { UseCheckReportServer } from './ReportConfigSetting.types';
import {
  OK_MESSAGE,
  SUCCESS_MESSAGE,
  defaultValues as initialValues,
} from './ReportConfigSetting.const';

export const useCheckReportServer = ({ url, publicKey }: UseCheckReportServer) => {
  const { appletId = '', ownerId = '' } = useParams();

  const onVerify = async () => {
    const token = authStorage.getAccessToken();

    try {
      const response = await verifyReportServer({ url, publicKey, token: `${token}` });
      const { message } = (await response.json()) ?? {};

      return message === OK_MESSAGE;
    } catch {
      return false;
    }
  };

  const onSetPassword = async (password: string) => {
    const token = authStorage.getAccessToken();

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

export const useDefaultValues = (appletData?: Partial<SingleApplet>) => {
  const { t } = useTranslation();
  const { activityId, activityFlowId } = useParams();
  if (!appletData) return initialValues;

  const {
    reportServerIp,
    reportPublicKey,
    reportRecipients,
    reportIncludeUserId,
    reportEmailBody,
  } = appletData;

  let reportIncludedItemName = '';
  let reportIncludedActivityName = '';

  if (activityId) {
    const activity = appletData.activities?.find(
      ({ id, key }) => activityId === id || activityId === key,
    );
    reportIncludedItemName = activity?.reportIncludedItemName || '';
  }

  if (activityFlowId) {
    const activityFlow = appletData.activityFlows?.find(
      ({ id, key }) => activityFlowId === id || activityFlowId === key,
    );
    reportIncludedItemName = activityFlow?.reportIncludedItemName || '';
    reportIncludedActivityName = activityFlow?.reportIncludedActivityName || '';
  }

  const defaultValues = {
    ...initialValues,
    reportServerIp,
    reportPublicKey,
    reportRecipients,
    reportIncludeUserId,
    reportIncludedItemName,
    reportIncludedActivityName,
    reportEmailBody: reportEmailBody || t('reportEmailBody'),
  };

  return defaultValues;
};
