import { useParams } from 'react-router-dom';

import { authStorage } from 'shared/utils/authStorage';
import { SingleApplet } from 'shared/state';
import { AppletFormValues } from 'modules/Builder/types';

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

export const useDefaultValues = (appletData?: SingleApplet | AppletFormValues) => {
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
    const activity = (appletData as SingleApplet).activities?.find(
      ({ id, key }) => activityId === id || activityId === key,
    );
    const { reportIncludedItemName: activityIncludedItemNameKey } = activity || {};

    if (activityIncludedItemNameKey) {
      reportIncludedItemName = activityIncludedItemNameKey;
    }
  }

  if (activityFlowId) {
    const activityFlow = (appletData as SingleApplet).activityFlows?.find(
      ({ id, key }) => activityFlowId === id || activityFlowId === key,
    );
    const {
      reportIncludedActivityName: flowIncludedActivityNameKey,
      reportIncludedItemName: flowIncludedItemNameKey,
    } = activityFlow || {};

    if (flowIncludedActivityNameKey) {
      reportIncludedActivityName = flowIncludedActivityNameKey;
    }

    if (flowIncludedItemNameKey) {
      reportIncludedItemName = flowIncludedItemNameKey;
    }
  }

  return {
    ...initialValues,
    reportServerIp,
    reportPublicKey,
    reportRecipients,
    reportIncludeUserId,
    reportIncludedItemName,
    reportIncludedActivityName,
    reportEmailBody,
    itemValue: !!reportIncludedActivityName || !!reportIncludedItemName,
  };
};
