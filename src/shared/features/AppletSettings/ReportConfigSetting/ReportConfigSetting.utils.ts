import { SingleApplet } from 'shared/state';

import { defaultValues } from './ReportConfigSetting.const';

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
