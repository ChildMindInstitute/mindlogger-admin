import * as yup from 'yup';

import i18n from 'i18n';
import {
  ACCOUNT_PASSWORD_MIN_LENGTH,
  ACCOUNT_PASSWORD_MIN_CHAR_TYPES,
  YUP_TEST_NAMES,
} from 'shared/consts';
import { checkPassword, getEmailValidationSchema } from 'shared/utils';

export const SignUpFormSchema = () => {
  const { t } = i18n;
  const firstNameRequired = t('firstNameRequired');
  const lastNameRequired = t('lastNameRequired');
  const passwordRequired = t('passwordRequired');
  const passwordMinLength = t('passwordMinLength', { chars: ACCOUNT_PASSWORD_MIN_LENGTH });
  const passwordBlankSpaces = t('passwordBlankSpaces');
  const passwordCharacterTypes = t('passwordCharacterTypes', {
    types: ACCOUNT_PASSWORD_MIN_CHAR_TYPES,
  });
  const termsOfServiceAgreementRequired = t('termsOfServiceAgreementRequired');

  return yup
    .object({
      email: getEmailValidationSchema(),
      firstName: yup.string().trim().required(firstNameRequired),
      lastName: yup.string().trim().required(lastNameRequired),
      password: yup
        .string()
        .required(passwordRequired)
        .test(
          YUP_TEST_NAMES.MIN_LENGTH,
          passwordMinLength,
          (password) => !password || checkPassword(password).meetsLength,
        )
        .test(
          YUP_TEST_NAMES.NO_WHITESPACE,
          passwordBlankSpaces,
          (password) => !password || checkPassword(password).hasNoSpaces,
        )
        .test(
          YUP_TEST_NAMES.CHAR_TYPES,
          passwordCharacterTypes,
          (password) => !password || checkPassword(password).meetsCharTypeRequirement,
        ),
      termsOfService: yup.boolean().oneOf([true], termsOfServiceAgreementRequired),
    })
    .required();
};
