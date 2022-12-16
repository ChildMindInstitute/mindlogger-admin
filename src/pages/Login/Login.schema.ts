import * as yup from 'yup';
import i18n from 'i18n';

export const loginSchema = () => {
  const { t } = i18n;
  const emailRequired = t('emailRequired');
  const incorrectEmail = t('incorrectEmail');
  const passwordRequired = t('passwordRequired');

  return yup
    .object({
      email: yup.string().required(emailRequired).email(incorrectEmail),
      password: yup.string().required(passwordRequired),
    })
    .required();
};
