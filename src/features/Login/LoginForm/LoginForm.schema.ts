import * as yup from 'yup';
import i18n from 'i18n';

export const loginFormSchema = () => {
  const { t } = i18n;
  const emailRequired = t('emailRequired');
  const incorrectEmail = t('incorrectEmail');
  const passwordRequired = t('passwordRequired');
  const passwordMinLength = t('passwordMinLength');
  const passwordBlankSpaces = t('passwordBlankSpaces');

  return yup
    .object({
      email: yup.string().required(emailRequired).email(incorrectEmail),
      password: yup
        .string()
        .required(passwordRequired)
        .min(8, passwordMinLength)
        .matches(/^(\S+$)/, passwordBlankSpaces),
    })
    .required();
};
