import i18n from 'i18n';
import * as yup from 'yup';

export const reportConfigSchema = () => {
  const { t } = i18n;
  const incorrectEmail = t('incorrectEmail');

  return yup
    .object({
      email: yup.string().email(incorrectEmail),
      respondentId: yup.string(),
      caseId: yup.string(),
      subject: yup.string().required(),
      description: yup.string(),
      serverURL: yup.string(),
      publicEncryptionKey: yup.string(),
    })
    .required();
};
