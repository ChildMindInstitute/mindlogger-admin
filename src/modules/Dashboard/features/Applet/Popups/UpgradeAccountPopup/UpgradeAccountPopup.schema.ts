import * as yup from 'yup';

import i18n from 'i18n';
import { EMAIL_REGEXP } from 'shared/consts';
import { Languages } from 'api';

export const UpgradeAccountPopupSchema = () => {
  const { t } = i18n;

  return yup
    .object({
      email: yup
        .string()
        .required(t('emailRequired'))
        .test('isValidEmail', t('incorrectEmail'), function (value) {
          if (value) {
            return EMAIL_REGEXP.test(value);
          }

          return true;
        }),
      language: yup.string().required().oneOf(Object.values(Languages)),
    })
    .required();
};
