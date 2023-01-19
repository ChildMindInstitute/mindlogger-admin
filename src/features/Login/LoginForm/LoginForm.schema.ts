import * as yup from 'yup';
import i18n from 'i18n';

export const loginFormSchema = () => {
  const { t } = i18n;
  const emailRequired = t('emailRequired');
  const incorrectEmail = t('incorrectEmail');
  const passwordRequired = t('passwordRequired');
  // const passwordMinLength = t('passwordMinLength');

  return yup
    .object({
      email: yup.string().required(emailRequired).email(incorrectEmail),
      password: yup
        .string()
        // .min(8, passwordMinLength)
        .required(passwordRequired),
    })
    .required();
};
