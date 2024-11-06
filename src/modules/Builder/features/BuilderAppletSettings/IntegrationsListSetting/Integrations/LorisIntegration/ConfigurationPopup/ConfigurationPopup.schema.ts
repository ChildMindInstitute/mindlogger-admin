import * as yup from 'yup';

import i18n from 'i18n';

export const configurationFormSchema = () => {
  const { t } = i18n;
  const hostnameRequired = t('loris.hostnameRequired');
  const usernameRequired = t('loris.usernameRequired');
  const passwordRequired = t('passwordRequired');

  return yup
    .object({
      project: yup.string(),
      hostname: yup.string().required(hostnameRequired),
      username: yup.string().required(usernameRequired),
      password: yup.string().required(passwordRequired),
    })
    .required();
};
