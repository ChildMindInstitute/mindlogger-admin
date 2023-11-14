import * as yup from 'yup';

import { getEmailValidationSchema } from 'shared/utils';

export const resetSchema = () =>
  yup
    .object({
      email: getEmailValidationSchema(),
    })
    .required();
