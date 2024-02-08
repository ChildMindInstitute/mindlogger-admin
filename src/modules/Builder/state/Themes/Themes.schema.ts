import { Theme } from 'modules/Builder/api';
import { Response } from 'shared/api';
import { BaseSchema } from 'shared/state/Base';

export type ThemesSchema = {
  themes: BaseSchema<Response<Theme> | null>;
};
