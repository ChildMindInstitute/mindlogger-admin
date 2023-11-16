import { Roles } from 'shared/consts';
import { ReportConfigFormValues } from 'shared/features/AppletSettings';

export type GetSettings = {
  isNewApplet?: boolean;
  isPublished?: boolean;
  roles?: Roles[];
  onReportConfigSubmit: (values: Partial<ReportConfigFormValues>) => void;
};
