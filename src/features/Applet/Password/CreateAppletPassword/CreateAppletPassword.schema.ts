import * as yup from 'yup';

import i18n from 'i18n';

export const createPasswordFormSchema = () => {
  const { t } = i18n;
  const passwordRequired = t('passwordRequired');
  const passwordMatchError = t('passwordMatchError');
  const passwordRequirements = t('appletPasswordRequirementsError');

  return yup
    .object({
      appletPassword: yup
        .string()
        .required(passwordRequired)
        .matches(
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[`~!@#$%^&*])(?=.{8,})/,
          passwordRequirements,
        ),
      appletPasswordConfirmation: yup
        .string()
        .required(passwordRequired)
        .oneOf([yup.ref('appletPassword')], passwordMatchError),
    })
    .required();
};
