import * as yup from 'yup';

import i18n from 'i18n';
import { LEGACY_PASSWORD_MIN_LENGTH, YUP_TEST_NAMES } from 'shared/consts';
import { checkPassword, getEmailValidationSchema } from 'shared/utils';

export const loginFormSchema = () => {
  const { t } = i18n;
  const passwordRequired = t('passwordRequired');
  const passwordMinLength = t('passwordMinLength', { chars: LEGACY_PASSWORD_MIN_LENGTH });
  const passwordBlankSpaces = t('passwordBlankSpaces');

  return yup
    .object({
      email: getEmailValidationSchema(),
      // Use legacy min-length (6) — existing users may have shorter passwords than the new policy (10).
      password: yup
        .string()
        .required(passwordRequired)
        .test(
          YUP_TEST_NAMES.MIN_LENGTH,
          passwordMinLength,
          (password) =>
            !password || checkPassword(password, LEGACY_PASSWORD_MIN_LENGTH).meetsLength,
        )
        .test(
          YUP_TEST_NAMES.NO_WHITESPACE,
          passwordBlankSpaces,
          (password) => !password || checkPassword(password).hasNoSpaces,
        ),
    })
    .required();
};
