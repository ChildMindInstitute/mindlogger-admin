import * as yup from 'yup';

import i18n from 'i18n';
import { ACCOUNT_PASSWORD_MIN_LENGTH } from 'shared/consts';
import { getEmailValidationSchema } from 'shared/utils';

export const loginFormSchema = () => {
  const { t } = i18n;
  const passwordRequired = t('passwordRequired');
  const passwordMinLength = t('passwordMinLength', { chars: ACCOUNT_PASSWORD_MIN_LENGTH });
  const passwordBlankSpaces = t('passwordBlankSpaces');

  return yup
    .object({
      email: getEmailValidationSchema(),
      password: yup
        .string()
        .required(passwordRequired)
        .min(ACCOUNT_PASSWORD_MIN_LENGTH, passwordMinLength)
        .matches(/^(\S+$)/, passwordBlankSpaces),
    })
    .required();
};
