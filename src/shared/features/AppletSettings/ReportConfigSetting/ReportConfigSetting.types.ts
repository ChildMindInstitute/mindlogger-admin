export type ReportConfigFormValues = {
  email: string;
  reportRecipients: string[];
  reportIncludeUserId: boolean;
  subject: string;
  reportEmailBody: string;
  reportServerIp: string;
  reportPublicKey: string;
};

export type VerifyReportServer = {
  url: string;
  publicKey: string;
  token: string;
};

export type UseCheckReportServer = {
  url: string;
  publicKey: string;
};

export type SetPasswordReportServer = {
  url: string;
  token: string;
  appletId: string;
  ownerId: string;
  password: string;
};

export type ReportConfigSettingProps = {
  isDashboard?: boolean;
  onSubmitSuccess?: (values: Partial<ReportConfigFormValues>) => void;
};
