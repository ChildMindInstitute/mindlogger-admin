import * as yup from 'yup';
import i18n from 'i18n';

export const createPasswordFormSchema = () => {
  const { t } = i18n;
  const passwordRequired = t('passwordRequired');
  const passwordMinLength = t('passwordMinLength');
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
        )
        .min(8, passwordMinLength),
      appletPasswordConfirmation: yup
        .string()
        .required(passwordRequired)
        .min(8, passwordMinLength)
        .oneOf([yup.ref('appletPassword'), null], passwordMatchError),
    })
    .required();
};
