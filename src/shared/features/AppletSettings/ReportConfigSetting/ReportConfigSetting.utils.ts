import { UseFormSetValue } from 'react-hook-form';

import { SingleApplet } from 'shared/state';
import i18n from 'i18n';

import { defaultValues } from './ReportConfigSetting.const';
import {
  VerifyReportServer,
  SetPasswordReportServer,
  ReportConfigFormValues,
} from './ReportConfigSetting.types';

const { t } = i18n;

const getUrl = (url: string) => (url?.endsWith('/') ? url : `${url}/`);

export const getDefaultValues = (appletData?: Partial<SingleApplet>) => {
  if (!appletData) return defaultValues;

  const {
    reportServerIp,
    reportPublicKey,
    reportRecipients,
    reportIncludeUserId,
    reportEmailBody,
  } = appletData;

  return {
    ...defaultValues,
    reportServerIp,
    reportPublicKey,
    reportRecipients,
    reportIncludeUserId,
    reportEmailBody: reportEmailBody || t('reportEmailBody'),
  };
};

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
