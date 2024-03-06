import * as yup from 'yup';

import i18n from 'i18n';
import { APPLET_PASSWORD_MIN_LENGTH } from 'shared/consts';

export const createPasswordFormSchema = () => {
  const { t } = i18n;
  const passwordRequired = t('passwordRequired');
  const repeatPasswordRequired = t('repeatPasswordRequired');
  const passwordMatchError = t('passwordMatchError');
  const passwordBlankSpaces = t('passwordBlankSpaces');
  const passwordCapitalLetter = t('passwordCapitalLetter');
  const passwordLowercaseLetter = t('passwordLowercaseLetter');
  const passwordNumber = t('passwordNumber');
  const passwordSpecialChar = t('passwordSpecialChar');
  const passwordMinLength = t('passwordMinLength', { chars: APPLET_PASSWORD_MIN_LENGTH });

  return yup
    .object({
      appletPassword: yup
        .string()
        .required(passwordRequired)
        .matches(/^(?=.*[a-z])/, passwordLowercaseLetter)
        .matches(/^(?=.*[A-Z])/, passwordCapitalLetter)
        .matches(/^(?=.*[0-9])/, passwordNumber)
        .matches(/^(?=.*[!"#$%&'()*+,-./:;<=>?@[\]^_`{|}~])/, passwordSpecialChar)
        .matches(/^\S+$/, passwordBlankSpaces)
        .min(APPLET_PASSWORD_MIN_LENGTH, passwordMinLength),
      appletPasswordConfirmation: yup
        .string()
        .required(repeatPasswordRequired)
        .oneOf([yup.ref('appletPassword'), ''], passwordMatchError),
    })
    .required();
};
