import { UseFormSetValue } from 'react-hook-form';

import { SingleApplet } from 'shared/state';
import { ActivityFlowFormValues, ActivityFormValues } from 'modules/Builder/types';

import {
  VerifyReportServer,
  SetPasswordReportServer,
  ReportConfigFormValues,
} from './ReportConfigSetting.types';

const getUrl = (url: string) => (url?.endsWith('/') ? url : `${url}/`);

export const getActivitiesOptions = (
  activityFlow?: ActivityFlowFormValues,
  appletData?: Partial<SingleApplet>,
) =>
  activityFlow?.items?.map(({ activityKey }) => {
    const activityName = appletData?.activities?.find(
      (activity) => activityKey === activity.id,
    )?.name;

    return {
      value: activityName ?? '',
      labelKey: activityName ?? '',
    };
  }) ?? [];

export const getActivityItemsOptions = (activity?: ActivityFormValues) =>
  activity?.items?.map(({ name }) => ({
    value: name,
    labelKey: name,
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
