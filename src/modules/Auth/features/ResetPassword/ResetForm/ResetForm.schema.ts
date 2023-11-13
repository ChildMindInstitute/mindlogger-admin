import * as yup from 'yup';

import i18n from 'i18n';

export const resetSchema = () => {
  const { t } = i18n;
  const emailRequired = t('emailRequired');
  const incorrectEmail = t('incorrectEmail');

  return yup
    .object({
      email: yup.string().required(emailRequired).email(incorrectEmail),
    })
    .required();
};
