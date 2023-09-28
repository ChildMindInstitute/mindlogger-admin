import * as yup from 'yup';

import i18n from 'i18n';

export const reportConfigSchema = () => {
  const { t } = i18n;
  const incorrectEmail = t('incorrectEmail');

  return yup
    .object({
      email: yup.string().email(incorrectEmail).required(),
      reportServerIp: yup.string().required(),
      reportPublicKey: yup.string().required(),
      reportEmailBody: yup.string().required(),
      reportRecipients: yup.array().of(yup.string().required()).required(),
      reportIncludeUserId: yup.boolean().required(),
      subject: yup.string().required(),
      itemValue: yup.boolean(),
      reportIncludedItemName: yup
        .string()
        .when('itemValue', {
          is: true,
          then: (shema) => shema.required(<string>t('pleaseSelectItem')),
        }),
      reportIncludedActivityName: yup.string().when('itemValue', {
        is: true,
        then: (shema) => shema.required(<string>t('pleaseSelectActivity')),
      }),
    })
    .required();
};
