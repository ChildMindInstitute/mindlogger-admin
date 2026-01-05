import * as yup from 'yup';

import i18n from 'i18n';

export const mfaFormSchema = () => {
  const { t } = i18n;

  return yup
    .object({
      totpCode: yup
        .string()
        .required(t('mfaCodeRequired'))
        .matches(/^\d{6}$/, t('mfaCodeFormat')),
    })
    .required()
    .strict(false)
    .noUnknown();
};

export const recoveryCodeSchema = () => {
  const { t } = i18n;

  return yup
    .object({
      code: yup
        .string()
        .required(t('recoveryCodeRequired'))
        .matches(/^[A-Z0-9]{5}-[A-Z0-9]{5}$/, t('recoveryCodeFormat')),
    })
    .required()
    .strict(false)
    .noUnknown();
};
