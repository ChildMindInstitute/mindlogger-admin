import * as yup from 'yup';

import i18n from 'i18n';
import { ACCOUNT_PASSWORD_MIN_LENGTH } from 'shared/consts';

export const newPasswordSchema = () => {
  const { t } = i18n;
  const passwordRequired = t('passwordRequired');
  const passwordConfirmationRequired = t('passwordConfirmationRequired');
  const passwordMinLength = t('passwordMinLength', { chars: ACCOUNT_PASSWORD_MIN_LENGTH });
  const passwordBlankSpaces = t('passwordBlankSpaces');
  const passwordsMustMatch = t('passwordsMustMatch');

  return yup
    .object({
      password: yup
        .string()
        .required(passwordRequired)
        .min(ACCOUNT_PASSWORD_MIN_LENGTH, passwordMinLength)
        .matches(/^(\S+$)/, passwordBlankSpaces),
      passwordConfirmation: yup
        .string()
        .required(passwordConfirmationRequired)
        .oneOf([yup.ref('password'), ''], passwordsMustMatch),
    })
    .required();
};
