import { useParams } from 'react-router-dom';

import { authStorage } from 'shared/utils/authStorage';
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
    const { reportIncludedItemName: activityIncludedItemName } = activity || {};
    if (
      activityIncludedItemName &&
      activity?.items.some((item) => item.name === activityIncludedItemName)
    ) {
      reportIncludedItemName = activityIncludedItemName;
    }
  }

  if (activityFlowId) {
    const activityFlow = appletData.activityFlows?.find(
      ({ id, key }) => activityFlowId === id || activityFlowId === key,
    );
    const {
      reportIncludedActivityName: flowIncludedActivityName,
      reportIncludedItemName: flowIncludedItemName,
    } = activityFlow || {};
    const chosenActivity = appletData.activities?.find(
      (activity) => activity.name === flowIncludedActivityName,
    );

    if (flowIncludedActivityName && chosenActivity) {
      reportIncludedActivityName = flowIncludedActivityName;

      if (
        flowIncludedItemName &&
        chosenActivity.items.some((item) => item.name === flowIncludedItemName)
      ) {
        reportIncludedItemName = flowIncludedItemName;
      }
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
