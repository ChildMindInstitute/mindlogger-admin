import { UseFormSetValue } from 'react-hook-form';

import { Activity, ActivityFlow, SingleApplet } from 'shared/state';

import {
  VerifyReportServer,
  SetPasswordReportServer,
  ReportConfigFormValues,
} from './ReportConfigSetting.types';

const getUrl = (url: string) => (url?.endsWith('/') ? url : `${url}/`);

export const getActivitiesOptions = (
  activityFlow?: ActivityFlow,
  appletData?: Partial<SingleApplet>,
) =>
  activityFlow?.items
    ?.map(
      ({ activityId }) =>
        appletData?.activities?.find((activity) => activityId === activity.id)?.name,
    )
    .map((name) => ({
      value: name || '',
      labelKey: name || '',
    })) || [];

export const getActivityItemsOptions = (activity: Activity) =>
  activity.items.map(({ name }) => ({
    value: name,
    labelKey: name,
  }));

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

export const setSubjectData = (
  setValue: UseFormSetValue<ReportConfigFormValues>,
  respondentId?: boolean,
) => {
  let subject = 'REPORT';
  if (respondentId) {
    subject += ' by [Respondent ID]';
  }
  subject += ': [Applet Name] / [Activity Name]';

  setValue('subject', subject);
};
