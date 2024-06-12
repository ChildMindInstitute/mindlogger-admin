import * as yup from 'yup';

import { getEmailValidationSchema } from 'shared/utils';

export const SendInvitationSchema = () =>
  yup
    .object({
      email: getEmailValidationSchema(),
    })
    .required();
