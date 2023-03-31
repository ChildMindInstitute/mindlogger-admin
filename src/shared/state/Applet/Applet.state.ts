import { base } from 'shared/state/Base';

import { AppletSchema } from './Applet.schema';

const initialStateData = {
  ...base.state,
  data: null,
};

export const state: AppletSchema = {
  applet: initialStateData,
};
