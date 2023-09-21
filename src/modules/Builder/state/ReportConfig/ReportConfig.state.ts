import { base } from 'shared/state/Base';

import { ReportConfigSchema } from './ReportConfig.schema';

const initialStateData = {
  ...base.state,
  data: null,
};

export const state: ReportConfigSchema = {
  configChanges: initialStateData,
};
