import { UseFormSetValue } from 'react-hook-form';

export type ReportConfigFormValues = {
  email: string;
  reportRecipients: string[];
  reportIncludeUserId: boolean;
  subject: string;
  reportEmailBody: string;
  reportServerIp: string;
  reportPublicKey: string;
  itemValue?: boolean;
  reportIncludedItemName?: string;
  reportIncludedActivityName?: string;
};

export type VerifyReportServer = {
  url: string;
  publicKey: string;
  token: string;
};

export type UseCheckReportServer = {
  url: string;
  publicKey: string;
  appletId: string;
  ownerId: string;
};

export type SetPasswordReportServer = {
  url: string;
  token: string;
  appletId: string;
  ownerId: string;
  password: string;
};

export type ReportConfigSettingProps = {
  'data-testid'?: string;
};

export type SetSubjectData = {
  setValue: UseFormSetValue<ReportConfigFormValues>;
  appletName?: string;
  activityName?: string;
  flowName?: string;
  flowActivityName?: string;
  respondentId?: boolean;
  hasActivityItemValue?: boolean;
  hasFlowItemValue?: boolean;
  itemName?: string;
};
