import * as yup from 'yup';

import i18n from 'i18n';
import { MAX_DESCRIPTION_LENGTH_LONG, MAX_NAME_LENGTH } from 'consts';

export const AboutAppletSchema = () => {
  const { t } = i18n;
  const fieldRequired = t('fieldRequired');

  return yup
    .object({
      name: yup.string().required(fieldRequired).max(MAX_NAME_LENGTH),
      description: yup.string().required(fieldRequired).max(MAX_DESCRIPTION_LENGTH_LONG),
      colorTheme: yup.string().required(),
      aboutApplet: yup.string().required(fieldRequired),
    })
    .required();
};
