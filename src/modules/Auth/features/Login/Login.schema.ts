import * as yup from 'yup';

import i18n from 'i18n';
import { getEmailValidationSchema } from 'shared/utils';

export const loginFormSchema = () => {
  const { t } = i18n;
  const passwordRequired = t('passwordRequired');

  return yup
    .object({
      email: getEmailValidationSchema(),
      password: yup.string().required(passwordRequired),
    })
    .required();
};
