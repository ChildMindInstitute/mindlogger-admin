import * as yup from 'yup';

import i18n from 'i18n';

export const passwordFormSchema = () => {
  const { t } = i18n;
  const passwordRequired = t('passwordRequired');
  const passwordRequirements = t('appletPasswordRequirementsError');

  return yup
    .object({
      appletPassword: yup
        .string()
        .required(passwordRequired)
        .matches(
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!"#$%&'()*+,-./:;<=>?@[\]^_`{|}~])(?=.{8,})/,
          passwordRequirements,
        ),
    })
    .required();
};
