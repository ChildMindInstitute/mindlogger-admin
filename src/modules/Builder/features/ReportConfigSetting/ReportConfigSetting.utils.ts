import {
  ActivityFlowFormValues,
  ActivityFormValues,
  AppletFormValues,
} from 'modules/Builder/types';
import { getEntityKey } from 'shared/utils';

import {
  VerifyReportServer,
  SetPasswordReportServer,
  SetSubjectData,
} from './ReportConfigSetting.types';

const getUrl = (url: string) => (url?.endsWith('/') ? url : `${url}/`);

export const getActivitiesOptions = (
  activityFlow?: ActivityFlowFormValues,
  appletData?: AppletFormValues,
) => {
  const uniqueValuesSet = new Set<string>();
  const activities = appletData?.activities;
  const activityFlowItems = activityFlow?.items;
  if (!activities || !activityFlowItems) return [];

  return activityFlowItems.reduce((acc: { value: string; labelKey: string }[], { activityKey }) => {
    const activity = activities.find((activity) => activityKey === getEntityKey(activity));
    const activityName = activity?.name;

    if (activityName && !uniqueValuesSet.has(activityKey)) {
      uniqueValuesSet.add(activityKey);
      acc.push({
        value: activityKey,
        labelKey: activityName,
      });
    }

    return acc;
  }, []);
};

export const getActivityItemsOptions = (activity?: ActivityFormValues | null) =>
  activity?.items?.map((item) => ({
    value: getEntityKey(item),
    labelKey: item.name,
  })) || [];

export const verifyReportServer = async ({ url, publicKey, token }: VerifyReportServer) => {
  const headers = new Headers();
  headers.append('Token', token);
  headers.append('Content-Type', 'application/json');

  const body = JSON.stringify({ publicKey });

  return await fetch(`${getUrl(url)}verify`, {
    method: 'PUT',
    headers,
    body,
  });
};

export const setPasswordReportServer = async ({
  url,
  appletId,
  ownerId,
  password,
  token,
}: SetPasswordReportServer) => {
  const headers = new Headers();
  headers.append('Token', token);
  headers.append('Content-Type', 'application/json');

  const body = JSON.stringify({ appletId, workspaceId: ownerId, password });

  return await fetch(`${getUrl(url)}set-password`, {
    method: 'POST',
    headers,
    body,
  });
};

export const setSubjectData = ({
  setValue,
  appletName,
  activityName,
  flowName,
  flowActivityName,
  respondentId,
  hasActivityItemValue,
  hasFlowItemValue,
  itemName,
}: SetSubjectData) => {
  let subject = 'REPORT';
  if (respondentId) {
    subject += ' by [Respondent ID]';
  }
  subject += `: ${appletName || '[Applet Name]'} / ${
    activityName || flowName || '[Activity Name]'
  }`;
  if (hasActivityItemValue) {
    subject += ` / [${itemName || 'Item name'}]`;
  }
  if (hasFlowItemValue) {
    subject += ` / ${flowActivityName || '[Activity Flow Name]'} / [${itemName || 'Item name'}]`;
  }

  setValue('subject', subject);
};
