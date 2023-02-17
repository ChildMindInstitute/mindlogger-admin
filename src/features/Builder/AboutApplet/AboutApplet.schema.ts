import * as yup from 'yup';

import i18n from 'i18n';

export const AboutAppletSchema = () => {
  const { t } = i18n;
  const fieldRequired = t('fieldRequired');

  return yup
    .object({
      name: yup.string().required(fieldRequired).max(55),
      description: yup.string().required(fieldRequired).max(230),
      colorTheme: yup.string().required(),
      aboutApplet: yup.string().required(fieldRequired),
    })
    .required();
};
