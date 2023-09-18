import { base } from 'shared/state/Base';

import { ThemesSchema } from './Themes.schema';

const initialStateData = {
  ...base.state,
  data: null,
};

export const state: ThemesSchema = {
  themes: initialStateData,
};
