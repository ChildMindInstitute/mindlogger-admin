import * as yup from 'yup';

import i18n from 'i18n';

export const passwordFormSchema = () => {
  const { t } = i18n;
  const passwordRequired = t('passwordRequired');

  return yup
    .object({
      appletPassword: yup.string().required(passwordRequired),
    })
    .required();
};
