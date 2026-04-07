import * as yup from 'yup';

import i18n from 'i18n';
import { ACCOUNT_PASSWORD_MIN_LENGTH } from 'shared/consts';
import { checkPassword, getEmailValidationSchema } from 'shared/utils';

export const SignUpFormSchema = () => {
  const { t } = i18n;
  const firstNameRequired = t('firstNameRequired');
  const lastNameRequired = t('lastNameRequired');
  const passwordRequired = t('passwordRequired');
  const passwordMinLength = t('passwordMinLength', { chars: ACCOUNT_PASSWORD_MIN_LENGTH });
  const passwordBlankSpaces = t('passwordBlankSpaces');
  const passwordCharacterTypes = t('passwordCharacterTypes');
  const termsOfServiceAgreementRequired = t('termsOfServiceAgreementRequired');

  return yup
    .object({
      email: getEmailValidationSchema(),
      firstName: yup.string().trim().required(firstNameRequired),
      lastName: yup.string().trim().required(lastNameRequired),
      password: yup
        .string()
        .required(passwordRequired)
        .min(ACCOUNT_PASSWORD_MIN_LENGTH, passwordMinLength)
        .test('no-whitespace', passwordBlankSpaces, (password) => !password || checkPassword(password).hasNoSpaces)
        .test('char-types', passwordCharacterTypes, (password) => !password || checkPassword(password).meetsCharTypeRequirement),
      termsOfService: yup.boolean().oneOf([true], termsOfServiceAgreementRequired),
    })
    .required();
};
