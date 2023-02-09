import * as yup from 'yup';

import i18n from 'i18n';

// TODO: request error texts and correct FR translations

export const SignUpFormSchema = () => {
  const { t } = i18n;
  const emailRequired = t('emailRequired');
  const incorrectEmail = t('incorrectEmail');
  const firstNameRequired = t('firstNameRequired');
  const lastNameRequired = t('lastNameRequired');
  const passwordRequired = t('passwordRequired');
  const passwordMinLength = t('passwordMinLength');
  const passwordBlankSpaces = t('passwordBlankSpaces');

  return yup
    .object({
      email: yup.string().required(emailRequired).email(incorrectEmail),
      firstName: yup.string().required(firstNameRequired),
      lastName: yup.string().required(lastNameRequired),
      password: yup
        .string()
        .required(passwordRequired)
        .min(6, passwordMinLength)
        .matches(/^(\S+$)/, passwordBlankSpaces),
    })
    .required();
};
