import { BaseSchema } from 'shared/state/Base';
import { Response } from 'shared/api';
import { Theme } from 'modules/Builder/api';

export type ThemesSchema = {
  themes: BaseSchema<Response<Theme> | null>;
};
