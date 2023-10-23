import { SingleApplet } from 'shared/state';
import { ActivityFlowFormValues, ActivityFormValues } from 'modules/Builder/types';

import {
  VerifyReportServer,
  SetPasswordReportServer,
  SetSubjectData,
} from './ReportConfigSetting.types';

const getUrl = (url: string) => (url?.endsWith('/') ? url : `${url}/`);

export const getActivitiesOptions = (
  activityFlow?: ActivityFlowFormValues,
  appletData?: Partial<SingleApplet>,
) => {
  const uniqueValuesSet = new Set<string>();
  const uniqueActivities = activityFlow?.items?.reduce(
    (acc: { value: string; labelKey: string }[], { activityKey }) => {
      const activityName = appletData?.activities?.find((activity) => activityKey === activity.id)
        ?.name;
      const value = activityName ?? '';

      if (!uniqueValuesSet.has(value)) {
        uniqueValuesSet.add(value);
        acc.push({
          value,
          labelKey: activityName ?? '',
        });
      }

      return acc;
    },
    [],
  );

  return uniqueActivities ?? [];
};

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
