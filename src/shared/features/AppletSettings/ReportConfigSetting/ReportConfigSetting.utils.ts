import { SingleApplet } from 'shared/state';

import { defaultValues } from './ReportConfigSetting.const';
import { VerifyReportServer, SetPasswordReportServer } from './ReportConfigSetting.types';

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
  const urlToCheck = url?.endsWith('/') ? url : `${url}/`;

  return await fetch(`${urlToCheck}verify`, {
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

  return await fetch(`${url}/set-password`, {
    method: 'POST',
    headers,
    body,
  });
};
