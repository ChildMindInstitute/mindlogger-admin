import { SingleApplet } from 'shared/state';

import { defaultValues } from './ReportConfigSetting.const';
import { VerifyReportServer, SetPasswordReportServer } from './ReportConfigSetting.types';

const getUrl = (url: string) => (url?.endsWith('/') ? url : `${url}/`);

export const getDefaultValues = (appletData?: Partial<SingleApplet>) => {
  if (!appletData) return defaultValues;

  const {
    reportServerIp,
    reportPublicKey,
    reportRecipients,
    reportIncludeUserId,
    reportIncludeCaseId,
    reportEmailBody,
  } = appletData;

  return {
    ...defaultValues,
    reportServerIp,
    reportPublicKey,
    reportRecipients,
    reportIncludeUserId,
    reportIncludeCaseId,
    reportEmailBody,
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
