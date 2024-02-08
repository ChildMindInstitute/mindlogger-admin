import { ReportConfigFormValues } from 'modules/Builder/features/ReportConfigSetting';
import { Roles } from 'shared/consts';

export type GetSettings = {
  isNewApplet?: boolean;
  isPublished?: boolean;
  roles?: Roles[];
  onReportConfigSubmit: (values: Partial<ReportConfigFormValues>) => void;
};
