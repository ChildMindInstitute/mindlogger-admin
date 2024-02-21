import { Roles } from 'shared/consts';
import { ReportConfigFormValues } from 'modules/Builder/features/ReportConfigSetting';
import { SingleApplet } from 'redux/modules';

export type GetSettings = {
  appletName?: string;
  isNewApplet?: boolean;
  isPublished?: boolean;
  roles?: Roles[];
  onReportConfigSubmit: (values: Partial<ReportConfigFormValues>) => void;
};
