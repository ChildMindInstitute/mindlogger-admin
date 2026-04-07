import * as yup from 'yup';

import i18n from 'i18n';
import { checkPassword, getEmailValidationSchema } from 'shared/utils';

export const loginFormSchema = () => {
  const { t } = i18n;
  const passwordRequired = t('passwordRequired');
  const passwordBlankSpaces = t('passwordBlankSpaces');

  return yup
    .object({
      email: getEmailValidationSchema(),
      // No min-length check — existing users may have shorter passwords.
      // The backend is the source of truth for rejecting invalid credentials.
      password: yup
        .string()
        .required(passwordRequired)
        .test('no-whitespace', passwordBlankSpaces, (password) => !password || checkPassword(password).hasNoSpaces),
    })
    .required();
};
