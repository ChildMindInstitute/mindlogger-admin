import * as yup from 'yup';

import i18n from 'i18n';

export const AboutAppletSchema = () => {
  const { t } = i18n;
  const nameRequired = t('nameRequired');
  const descriptionRequired = t('descriptionRequired');
  const aboutAppletRequired = t('aboutAppletRequired');

  return yup
    .object({
      name: yup.string().required(nameRequired).max(55),
      description: yup.string().required(descriptionRequired).max(230),
      colorTheme: yup.string().required(),
      aboutApplet: yup.string().required(aboutAppletRequired),
    })
    .required();
};
