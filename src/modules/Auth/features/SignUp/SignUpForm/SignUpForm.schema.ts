import * as yup from 'yup';

import i18n from 'i18n';
import { ACCOUNT_PASSWORD_MIN_LENGTH } from 'shared/consts';

export const SignUpFormSchema = () => {
  const { t } = i18n;
  const emailRequired = t('emailRequired');
  const incorrectEmail = t('incorrectEmail');
  const firstNameRequired = t('firstNameRequired');
  const lastNameRequired = t('lastNameRequired');
  const passwordRequired = t('passwordRequired');
  const passwordMinLength = t('passwordMinLength', { chars: ACCOUNT_PASSWORD_MIN_LENGTH });
  const passwordBlankSpaces = t('passwordBlankSpaces');

  return yup
    .object({
      email: yup.string().required(emailRequired).email(incorrectEmail),
      firstName: yup.string().trim().required(firstNameRequired),
      lastName: yup.string().trim().required(lastNameRequired),
      password: yup
        .string()
        .required(passwordRequired)
        .min(ACCOUNT_PASSWORD_MIN_LENGTH, passwordMinLength)
        .matches(/^(\S+$)/, passwordBlankSpaces),
      termsOfService: yup.boolean(),
    })
    .required();
};
