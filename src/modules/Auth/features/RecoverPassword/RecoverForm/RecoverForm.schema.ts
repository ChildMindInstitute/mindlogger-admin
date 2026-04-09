import * as yup from 'yup';

import i18n from 'i18n';
import { ACCOUNT_PASSWORD_MIN_LENGTH, ACCOUNT_PASSWORD_MIN_CHAR_TYPES } from 'shared/consts';
import { checkPassword } from 'shared/utils';

export const newPasswordSchema = () => {
  const { t } = i18n;
  const passwordRequired = t('passwordRequired');
  const passwordConfirmationRequired = t('passwordConfirmationRequired');
  const passwordMinLength = t('passwordMinLength', { chars: ACCOUNT_PASSWORD_MIN_LENGTH });
  const passwordBlankSpaces = t('passwordBlankSpaces');
  const passwordCharacterTypes = t('passwordCharacterTypes', {
    types: ACCOUNT_PASSWORD_MIN_CHAR_TYPES,
  });
  const passwordsMustMatch = t('passwordsMustMatch');

  return yup
    .object({
      password: yup
        .string()
        .required(passwordRequired)
        .test(
          'min-length',
          passwordMinLength,
          (password) => !password || checkPassword(password).meetsLength,
        )
        .test(
          'no-whitespace',
          passwordBlankSpaces,
          (password) => !password || checkPassword(password).hasNoSpaces,
        )
        .test(
          'char-types',
          passwordCharacterTypes,
          (password) => !password || checkPassword(password).meetsCharTypeRequirement,
        ),
      passwordConfirmation: yup
        .string()
        .required(passwordConfirmationRequired)
        .oneOf([yup.ref('password'), ''], passwordsMustMatch),
    })
    .required();
};
