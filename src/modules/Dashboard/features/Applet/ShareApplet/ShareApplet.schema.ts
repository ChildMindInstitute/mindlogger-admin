import * as yup from 'yup';

import i18n from 'i18n';

export const ShareAppletSchema = () => {
  const { t } = i18n;
  const appletNameRequired = t('appletNameRequired');

  return yup
    .object({
      appletName: yup.string().required(appletNameRequired),
    })
    .required();
};
