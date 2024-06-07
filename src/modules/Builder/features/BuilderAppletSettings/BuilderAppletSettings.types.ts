import { Roles } from 'shared/consts';
import { ReportConfigFormValues } from 'modules/Builder/features/ReportConfigSetting';

export type GetSettings = {
  isNewApplet?: boolean;
  isPublished?: boolean;
  roles?: Roles[];
  onReportConfigSubmit: (values: Partial<ReportConfigFormValues>) => void;
  appletId?: string;
};
