import i18n from 'i18n';
import * as yup from 'yup';

export const reportConfigSchema = () => {
  const { t } = i18n;
  const incorrectEmail = t('incorrectEmail');

  return yup
    .object({
      email: yup.string().email(incorrectEmail),
    })
    .required();
};
